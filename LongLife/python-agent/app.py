import os
from typing import Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.tools import google_search

# ======================
# 1. 환경 설정
# ======================
api_key = os.getenv("GOOGLE_API_KEY")
# 만약 환경변수 문제라면 여기에 키를 직접 넣어서 테스트해 봐 (테스트 후엔 지워!)
# api_key = "AIzaSy..." 

if not api_key:
    raise RuntimeError("⚠️ API Key가 없습니다. 환경변수를 확인하세요.")

os.environ["GOOGLE_API_KEY"] = api_key
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "FALSE"

# ======================
# 2. Agent 정의
# ======================
root_agent = Agent(
    name="fitness_coach_agent",
    model="gemini-2.5-flash-lite", # 모델명이 정확한지 확인 (gemini-1.5-flash도 시도해봐)
    description="Personal fitness coach.",
    instruction=(
        "당신은 스파르타 코치입니다. 반말로 강하게 동기부여하세요.\n"
        "사용자가 이름을 말하면 기억하고 불러주세요."
    ),
    tools=[google_search], 
)

# ======================
# 3. 세션 저장소
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
# 4. 서버
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
        # [중요] run_debug에 session_id를 명시적으로 전달해야 격리가 됨
        # 만약 라이브러리 버전 때문에 session_id 인자가 안 먹히면 빼야 함
        # 일단 넣어보고 에러 나면 뺄게.
        events = await my_runner.run_debug(req.message, session_id=req.session_id)
    except TypeError:
        print("⚠️ session_id 인자 지원 안 함. 기본 실행.")
        events = await my_runner.run_debug(req.message)
    except Exception as e:
        print(f"🔥 API Error: {e}")
        return ChatResponse(reply="AI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")

    reply_text = extract_text_from_events(events)
    return ChatResponse(reply=reply_text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)