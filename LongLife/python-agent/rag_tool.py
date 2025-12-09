import os
import glob
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# DB 저장 경로 (프로젝트 폴더 내에 생성됨)
PERSIST_DIR = "./chroma_db"
DATA_DIR = "./data"

# 1. 임베딩 모델 설정
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# 2. Vector DB 초기화 (없으면 생성, 있으면 로드)
vector_store = None

def initialize_rag():
    global vector_store
    
    # 이미 DB가 있으면 로드만 함
    if os.path.exists(PERSIST_DIR) and os.listdir(PERSIST_DIR):
        print("📂 기존 Vector DB를 로드합니다...")
        vector_store = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
        return

    # DB가 없으면 PDF 로딩 시작
    print("🚀 PDF 데이터를 로딩하고 Vector DB를 구축합니다... (시간이 좀 걸립니다)")
    
    pdf_files = glob.glob(os.path.join(DATA_DIR, "*.pdf"))
    if not pdf_files:
        print("⚠️ 경고: data 폴더에 PDF 파일이 없습니다!")
        # 빈 DB라도 생성해서 에러 방지
        vector_store = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
        return

    documents = []
    for pdf_file in pdf_files:
        try:
            loader = PyPDFLoader(pdf_file)
            docs = loader.load()
            documents.extend(docs)
            print(f"  - 로딩 완료: {pdf_file} ({len(docs)} 페이지)")
        except Exception as e:
            print(f"  - 실패: {pdf_file} / 에러: {e}")

    # 텍스트 쪼개기
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)

    # DB 저장
    vector_store = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=PERSIST_DIR
    )
    print(f"✅ Vector DB 구축 완료! (총 {len(splits)}개 청크 저장됨)")

# 3. 검색 도구 함수 (이걸 Agent가 쓸 것임)
def query_google_whitepapers(query_text: str):
    """
    Google의 Gen AI, Agent, MCP, Context Engineering 관련 백서(Whitepaper) 내용을 검색합니다.
    사용자가 구글의 최신 기술, 에이전트 아키텍처, 프롬프트 엔지니어링 등에 대해 물어볼 때 사용하세요.
    
    Args:
        query_text: 검색할 질문 내용
    """
    if vector_store is None:
        return "죄송합니다. 아직 지식 데이터베이스가 준비되지 않았습니다."

    # 유사도 검색 (상위 3개 문서 추출)
    results = vector_store.similarity_search(query_text, k=3)
    
    # 검색된 내용을 하나의 문자열로 합침
    context = "\n\n".join([doc.page_content for doc in results])
    return f"[참고 문헌 데이터]\n{context}"

# 모듈 로드 시 DB 초기화 실행
initialize_rag()