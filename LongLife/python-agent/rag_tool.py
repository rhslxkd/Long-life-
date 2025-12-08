import os
import glob
import pandas as pd
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# ==========================================
# 1. 설정 (경로 및 모델)
# ==========================================
PERSIST_DIR = "./chroma_db"
DATA_ROOT = "./data"

# 임베딩 모델
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# 전역 변수
fitness_vector_store = None
diet_vector_store = None

# ==========================================
# 2. 엑셀 로더 (Pandas 기반 커스텀 로더)
# ==========================================
def load_excel_as_documents(file_path: str):
    """
    엑셀 파일을 읽어서 각 행(Row)을 하나의 문서(Document)로 변환합니다.
    형식: "컬럼1: 값1, 컬럼2: 값2 ..." 
    """
    try:
        df = pd.read_excel(file_path)
        # 빈 데이터 제거
        df = df.dropna(how='all') 
        
        docs = []
        for index, row in df.iterrows():
            # 각 행의 데이터를 "키: 값" 형태의 문자열로 변환
            # 예: "운동명: 벤치프레스, 부위: 가슴, 설명: 미는 운동"
            row_text = ", ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
            
            # 메타데이터에 파일명과 행 번호 저장 (나중에 출처 찾기 좋음)
            metadata = {"source": os.path.basename(file_path), "row": index}
            
            docs.append(Document(page_content=row_text, metadata=metadata))
            
        return docs
    except Exception as e:
        print(f"   🔥 엑셀 읽기 실패: {file_path} - {e}")
        return []

# ==========================================
# 3. 핵심 로직: DB 생성/로드
# ==========================================
def get_or_create_vectorstore(category: str):
    target_folder = os.path.join(DATA_ROOT, category)
    collection_name = f"{category}_collection"
    
    print(f"🔍 [{category}] 엑셀 데이터 DB 확인 중...")

    vector_store = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings,
        collection_name=collection_name
    )

    existing_count = len(vector_store.get()['ids'])
    if existing_count > 0:
        print(f"  ✅ [{category}] 기존 DB 로드 완료! (데이터 수: {existing_count})")
        return vector_store

    print(f"  🚀 [{category}] 데이터가 비어있습니다. 엑셀 로딩 시작...")
    
    # 엑셀 파일 찾기 (*.xlsx, *.xls)
    excel_files = glob.glob(os.path.join(target_folder, "*.xlsx")) + glob.glob(os.path.join(target_folder, "*.xls"))
    
    if not excel_files:
        print(f"  ⚠️ 경고: '{target_folder}' 폴더에 엑셀 파일이 없습니다!")
        return vector_store

    documents = []
    for file in excel_files:
        docs = load_excel_as_documents(file)
        documents.extend(docs)
        print(f"   - 읽음: {os.path.basename(file)} ({len(docs)}개 행)")

    if documents:
        # 엑셀은 이미 행 단위로 잘려있어서 chunk_size를 크게 잡거나 split을 안 해도 되지만,
        # 내용이 엄청 긴 셀이 있을 수 있으니 안전장치로 둠.
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        splits = splitter.split_documents(documents)
        
        vector_store.add_documents(splits)
        print(f"  💾 [{category}] DB 구축 완료! (총 {len(splits)}개 데이터 저장)")
    
    return vector_store

# ==========================================
# 4. 초기화 실행
# ==========================================
def initialize_rags():
    global fitness_vector_store, diet_vector_store
    fitness_vector_store = get_or_create_vectorstore("fitness")
    diet_vector_store = get_or_create_vectorstore("diet")

# ==========================================
# 5. Agent용 검색 도구
# ==========================================
def search_fitness_db(query: str) -> str:
    """[운동/헬스] 질문 시 사용. 엑셀 DB에서 운동법, 자세 등을 검색."""
    if not fitness_vector_store: return "운동 지식 DB 준비 안됨."
    results = fitness_vector_store.similarity_search(query, k=3)
    return "[운동 검색 결과]\n" + "\n".join([f"- {doc.page_content}" for doc in results])

def search_diet_db(query: str) -> str:
    """[식단/영양] 질문 시 사용. 엑셀 DB에서 칼로리, 식단표 등을 검색."""
    if not diet_vector_store: return "식단 지식 DB 준비 안됨."
    results = diet_vector_store.similarity_search(query, k=3)
    return "[식단 검색 결과]\n" + "\n".join([f"- {doc.page_content}" for doc in results])

# 자동 실행
initialize_rags()