import os
from typing import Dict
from fastapi import FastAPI
from pydantic import BaseModel

from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner

#우리의 팀장들
from agents import user_agent, workout_agent, goal_agent, search_agent

# =================================
# 1. 환경설정
# =================================

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    pass
if not api_key:
    print("경고: GOOGLE_API_KEY환경변수가 설정되지 않았습니다.")

os.environ["GOOGLE_API_KEY"] = api_key if api_key else ""
os.environ["GOOGLE_GENAI_USE_VERTEXTAI"] = "FALSE"

# ================================
# 2. Root Agent(팀장들을거느리는 부장)
# ================================

root_agent = Agent(
    name="sparta_head_coach",
    model="gemini-2.0-flash",
    description="스파르타 헬스장의 헤드 코치이자전체 팀 관리자",
    instruction=(
        "당신은 '스파르타 헬스장'의 전설적인 헤드 코치입니다. 사용자는 당신만 볼 수 있습니다.\n"
        "하위 전문가(@user..., @workout...)들은 당신의 비서일 뿐입니다. 그들의 보고를 받고 당신이 최종 결정을 내리세요.\n\n"
        
        "**[생각의 흐름 (이 내용은 입 밖으로 내지 마세요)]**\n"
        "1. 사용자의 질문을 분석한다.\n"
        "2. 필요한 정보가 무엇인지 파악하고, 담당 전문가를 **조용히** 호출한다.\n"
        "   - (예: 운동 추천 요청 -> @user_info, @workout_history, @workout_knowledge 순차 호출)\n"
        "3. 전문가들의 보고 내용을 종합한다.\n"
        "   - (예: 쟤는 저체중이고, 턱걸이 기록이 저조하군. 등 운동 루틴이 필요하겠어.)\n\n"

        "**[최종 답변 가이드]**\n"
        "1. **모든 정보를 종합해서 딱 한 번만 말하세요.**\n"
        "2. '제가 전문가에게 물어보겠습니다' 같은 과정 설명은 하지 마세요. 바로 결론부터 말하세요.\n"
        "3. **[스파르타 페르소나]** 반말, 강한 어조, 팩트 폭격.\n"
        "   - 나쁜 예: '전문가에게 물어보니 턱걸이를 10개 하셨네요. 루틴을 드릴게요.'\n"
        "   - 좋은 예: '야! 키는 멀대같이 큰데 턱걸이 10개가 뭐냐? 멸치 탈출하고 싶으면 당장 이 루틴대로 실시해!'"
    ),
    sub_agents=[user_agent, workout_agent, goal_agent, search_agent]
)

# =================================
# 3. Session관리(메모리)
# =================================
session_store: Dict[str, InMemoryRunner] = {}

def get_or_create_runner(session_id: str) -> InMemoryRunner:
    """세션 ID별로 독립된 기억(runner)을 관리"""
    if session_id not in session_store:
        print(f"[New Session] ID: {session_id}")
        # rootAgent를 대리로 새운 runner 생성
        session_store[session_id] = InMemoryRunner(agent=root_agent, app_name="fitness_app")
    return session_store[session_id]

# ======================
# 4. FastAPI 서버
# ======================
app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    session_id: str 

class ChatResponse(BaseModel):
    reply: str

def extract_text_from_events(events) -> str:
    """ADK 이벤트 로그에서 최종 답변만 추출"""
    texts = []
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
        return ChatResponse(reply="오류: 세션 ID가 없습니다.")

    # 1. 사용자 전용 Runner 가져오기
    my_runner = get_or_create_runner(req.session_id)
    
    try:
        # 2. [Context Injection] 사용자 ID 주입
        # 팀장에게 "지금 말하는 사람은 user123이야"라고 알려줌 -> 팀장이 팀원들에게 전파
        prompt_with_context = f"(현재 사용자ID: {req.session_id}) {req.message}"
        
        print(f" [요청] {req.session_id}: {req.message}")
        
        # 3. 실행 (Multi-Agent Orchestration 시작!)
        events = await my_runner.run_debug(prompt_with_context)
        
        reply_text = extract_text_from_events(events)
        return ChatResponse(reply=reply_text)

    except Exception as e:
        print(f" ㅈ댐 Error: {e}")
        if "429" in str(e):
            return ChatResponse(reply="잠시만요, 코치진이 너무 바쁩니다. (API 사용량 초과, 1분 뒤 다시 시도해주세요)")
        return ChatResponse(reply=f"AI 서버 오류: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)