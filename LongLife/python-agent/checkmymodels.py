import os
from google import genai
from dotenv import load_dotenv

# 1. 환경변수 로드
load_dotenv() 
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ API Key가 없습니다. 환경변수를 확인하세요.")
    exit()

# 2. 클라이언트 생성
client = genai.Client(api_key=api_key)

print(f"✅ 내 API Key로 접근 가능한 모델 목록:\n{'='*40}")

try:
    # 3. 모델 목록 가져오기
    for m in client.models.list():
        # 복잡한 필터링 빼고 그냥 이름만 출력!
        # m.name은 보통 'models/gemini-1.5-flash' 같은 형태임
        print(f" - {m.name}")
        
except Exception as e:
    print(f"\n🔥 에러 발생: {e}")
    print("라이브러리 버전 문제일 수 있으니, 일단 목록 조회는 여기까지.")