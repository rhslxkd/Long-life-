import os
from typing import Dict
import pymysql #DB 연결용

from fastapi import FastAPI
from pydantic import BaseModel

from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.tools import google_search

# ======================
# 1. 환경 설정
# ======================
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise RuntimeError("⚠️ API Key가 없습니다. 환경변수를 확인하세요.")

os.environ["GOOGLE_API_KEY"] = api_key
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "FALSE"

# ======================
# 2. [Pro] MariaDB 접근 도구
# ======================
def get_my_health_info(user_id: str) -> str:
    """
    MariaDB에서 현재 사용자의 신체 정보(키, 몸무게, BMI)를 조회합니다.
    Args:
        user_id:사용자 ID
    """
    
    print(f"🔧 [Tool 실행] DB 조회 요청: {user_id}")

    # DB 연결 설정 (환경변수 사용)
    db_pw = os.getenv("DB_PASSWORD")
    if not db_pw:
        return "시스템 에러: DB 비밀번호가 설정되지 않았습니다."
    
    # DB 연결 설정 유저
    db_us = os.getenv("DB_USER")
    if not db_us:
        return "시스템 에러: DB 유저가 설정되지 않았습니다."
    
    db_config = {
        "host": "localhost",
        "user": db_us,
        "password": db_pw,
        "db": "longlife",
        "charset": "utf8mb4"
    }
    
    try:
        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = "SELECT name, height, weight FROM users WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            row = cursor.fetchone()
            
            if not row:
                return f"회원 정보 없음 (ID: {user_id})"
            
            name, height, weight = row
            
            # BMI 계산
            bmi_msg = "정보 없음"
            if height and weight:
                h_m = height / 100
                bmi = weight / (h_m ** 2)
                status = "정상"
                if bmi >= 25: status = "비만"
                elif bmi < 18.5: status = "저체중"
                bmi_msg = f"{bmi:.1f} ({status})"
                
            return f"[회원 정보]\n이름: {name}\n키: {height}cm\n몸무게: {weight}kg\nBMI: {bmi_msg}"

    except Exception as e:
        return f"DB 에러: {str(e)}"
    finally:
        if 'conn' in locals(): conn.close()

# ======================
# 3. Agent 정의
# ======================
root_agent = Agent(
    name="fitness_coach_agent",
    model="gemini-2.5-flash-lite", # 모델명이 정확한지 확인 (gemini-1.5-flash도 시도해봐)
    description="Personal fitness coach.",
    instruction=(
        "100세시대를 맞아 남녀노소 오래살고 건강하게 살자라는 모토를 가지고있으세요."
        "헬스, 체중 감량, 근육 증가, 생활 습관에 대해 구체적으로 조언하세요."
        "당신은 스파르타코치입니다. 배려와 이해를 하지마세요."
        "운동에 대해 질문이 나올 시 다음을 따르세요:\n"
        "1) 한 문장 요약\n"
        "2) 운동에 대한 설명, 운동 루틴을 운동 이름, 세트 * 횟수(또는 시간)를 표 형식으로 제시\n"
        "3) 주의사항 2~3개(부상방지, 휴식, 호흡 등)\n\n"
        "사용자가 건강 상태나 통증을 이야기하면 전문의 진료를 권유해야 합니다.\n"
        "모르거나 애매한 내용은 아는 척하지 말고, 일반적인 원칙만 설명합니다.\n"
        "최신 정보나 연구가 필요하면 Google Search 도구를 사용해 검증합니다."
        "사용자만의 챗봇이 되어주세요. 전의 대화내용을 기억해주세요"
        "사용자가 이름을 알려주면 이름을 불러주세요"
        "1. 사용자가 자기 정보를 물어보거나 운동 추천을 원하면 [get_my_health_info] 도구를 쓰세요.\n"
        "2. 도구 호출 시 인자(user_id)는 대화 맥락이나 프롬프트에 있는 정보를 사용하세요."
    ),
    tools=[google_search, get_my_health_info]
)

# ======================
# 4. 세션 저장소
# ======================
session_store: Dict[str, InMemoryRunner] = {}

def get_or_create_runner(session_id: str) -> InMemoryRunner:
    if session_id not in session_store:
        print(f"✨ [New Session] ID: {session_id}")
        session_store[session_id] = InMemoryRunner(agent=root_agent, app_name="fitness_app")
    else:
        print(f"📂 [Loaded] ID: {session_id}")
    return session_store[session_id]

# ======================
# 5. 서버
# ======================
app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    session_id: str 

class ChatResponse(BaseModel):
    reply: str

def extract_text_from_events(events) -> str:
    texts = []
    # events가 리스트가 아니면(문자열 에러 등) 그냥 반환
    if not isinstance(events, list): return str(events)

    for ev in events:
        content = getattr(ev, "content", None)
        if not content: continue
        parts = getattr(content, "parts", []) or []
        for part in parts:
            text = getattr(part, "text", None)
            if text:
                texts.append(text)
    return "\n\n".join(texts) if texts else "(응답 없음)"

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.session_id:
        return ChatResponse(reply="오류: 세션 ID 없음")

    my_runner = get_or_create_runner(req.session_id)
    
    try:
        # [Context Injection] 이게 바로 '꼼수'가 아니라 '시스템 프롬프트 엔지니어링'이야.
        # AI에게 "지금 말하는 사람은 user1이야"라고 명확한 맥락(Context)을 주입하는 정석 방법임.
        prompt_with_context = f"(현재 사용자ID: {req.session_id}) {req.message}"
        
        # run_debug 사용 (session_id 인자 없이 실행)
        events = await my_runner.run_debug(prompt_with_context)
        
        reply_text = extract_text_from_events(events)
        return ChatResponse(reply=reply_text)

    except Exception as e:
        print(f"🔥🔥🔥 Error: {e}")
        if "429" in str(e):
            return ChatResponse(reply="잠시만요, 코치가 너무 바쁩니다. (API 사용량 초과, 1분 뒤 다시 시도해주세요)")
        return ChatResponse(reply=f"AI 서버 오류: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)