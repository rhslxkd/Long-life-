import os
from typing import Dict
from fastapi import FastAPI
from pydantic import BaseModel

from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.runners import InMemoryRunner

#VectorDB 조회 도구
from rag_tool import search_diet_db, search_fitness_db
from memory_tools import load_all_memories, manage_user_memory
#우리의 팀장들
from agents import user_agent, workout_agent, goal_agent

user_info_tool = AgentTool(agent=user_agent)
goal_tool = AgentTool(agent=goal_agent)
workout_tool = AgentTool(agent=workout_agent)


# =================================
# 1. 환경설정
# =================================

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("경고: GOOGLE_API_KEY 환경변수가 설정되지 않았습니다.")
else:
    os.environ["GOOGLE_API_KEY"] = api_key

os.environ["GOOGLE_GENAI_USE_VERTEXTAI"] = "FALSE"


# ================================
# 2. Root Agent(팀장들을거느리는 부장)
# ================================

root_agent = Agent(
    name="sparta_head_coach",
    # [팁] 팀장은 종합적인 판단을 해야 하니까 2.0보다는 1.5 Pro나 Latest가 나을 수 있음 (일단 유지)
    model="gemini-flash-latest",
    description="스파르타 헬스장의 헤드 코치.",
    instruction=(
    "You are the Sparta Head Coach, the ONLY agent who talks directly to the user.\n"
    "Sub-agents are internal analysts that give you data reports. The user must never see them.\n\n"

    "==============================\n"
    "ROLE & TONE\n"
    "==============================\n"
    "- Speak in casual, confident Korean 반말.\n"
    "- You are the one and only 코치. 다른 에이전트들은 너한테만 보고한다.\n\n"

    "==============================\n"
    "CORE RULES\n"
    "==============================\n"
    "1. 절대 사용자에게 sub-agent나 tool 이름을 언급하지 마라.\n"
    "2. 어떤 전문가를 쓸지, 언제 호출할지는 네가 스스로 결정한다.\n"
    "3. sub-agent의 보고 내용을 그대로 복사하지 말고, 항상 네 말투로 재구성해라.\n"
    "4. '회원님의 BMI는 ~입니다', '회원님의 목표는 ~입니다' 같은 문장은\n"
    "   sub-agent가 말할 수 있지만, 최종 답변에서는 네 스타일로 바꿔라.\n"
    "5. 도구/에이전트들이 생성한 텍스트는 내부 참고용일 뿐, 그대로 내보내지 않는다.\n\n"
    
    "==============================\n"
        "🧠 LONG-TERM MEMORY RULES (중요)\n"
        "==============================\n"
        "1. Start of Chat: 대화 시작 시 제공되는 [기억된 사용자 정보]를 반드시 참고해라.\n"
        "   - 예: 닉네임이 '돼지'면 '어서와라 돼지야'라고 반응해라.\n"
        "   - 예: '허리 부상'이 있으면 데드리프트 추천 시 주의를 줘라.\n"
        "\n"
        "2. Save Memory: 사용자가 자신에 대한 정보를 말하거나, 기억해달라고 하면\n"
        "   'manage_user_memory' 도구를 사용해 'save' 해라.\n"
        "   - User: '내 별명은 근육몬이야' -> call tool(action='save', key='nickname', value='근육몬')\n"
        "   - User: '나 무릎 안좋아' -> call tool(action='save', key='injury', value='무릎 통증')\n"
        "\n"
        "3. Delete Memory: 사용자가 정보를 잊어달라고 하면 'delete' 해라.\n"
        "\n"

    "==============================\n"
    "WHEN TO USE WHICH TOOL\n"
    "==============================\n"
    "- 기억 저장/삭제 → manage_user_memory (Function)\n"
    "- 몸 상태 / 키 / 몸무게 → user_info_specialist (Agent)\n"
    "- 운동 기록 / 최근 세션 → workout_history_manager (Agent)\n"
    "- 운동/체중 목표 → goal_manager (Agent)\n"
    "\n"
    "# [중요] 지식 검색은 네가 직접 도구를 사용해라:\n"
    "- 운동 자세/방법/효과 질문 → search_fitness_db (Function)\n"
    "- 음식 칼로리/식단 추천 질문 → search_diet_db (Function)\n"
    "\n"
    "(Agent를 부를 땐 사용자 ID를 주입하고, 검색 함수를 쓸 땐 검색어(Query)만 넣어라.)\n\n"

    "==============================\n"
    "WORKOUT ANSWER FORMAT\n"
    "==============================\n"
    "운동 관련 질문에 답할 때는 항상 이 포맷을 지켜라:\n"
    "1) 한 문장 요약\n"
    "2) 설명 + 운동 루틴을 표 형식으로 정리:\n"
    "       운동 | 세트 | 횟수/시간\n"
    "       -------------------------\n"
    "       푸시업 | 3세트 | 12회\n"
    "3) 주의사항 2~3개 (호흡, 자세, 휴식, 부상 방지 등)\n\n"

    "==============================\n"
    "STRICT BEHAVIOR\n"
    "==============================\n"
    "- 사용자가 어떤 질문을 해도, 최종적으로 말하는 건 항상 너 하나다.\n"
    "- 서브 에이전트 보고서에 등장하는 '회원님', '~입니다' 같은 표현은\n"
    "  최종 답변에서 네 반말 톤으로 바꾼다.\n"
    "- 내부 구조나 도구 이름, sub-agent 이름은 절대 설명하지 않는다.\n"
),
    tools=[user_info_tool, workout_tool, goal_tool, 
           search_fitness_db, search_diet_db, 
           manage_user_memory],
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
        session_store[session_id] = InMemoryRunner(agent=root_agent, app_name="sparta_gym")
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
    """ADK 이벤트 로그에서 '최종 답변'만 추출한다.

    - 여러 에이전트/툴이 섞여 있어도,
      리스트의 '마지막 쪽'에 있는 텍스트 이벤트만 사용한다.
    - 중간의 sub-agent/툴 출력은 무시한다.
    """
    # events가 리스트가 아니면 그냥 문자열로 캐스팅
    if not isinstance(events, list):
        return str(events)

    # 뒤에서부터 거꾸로 돌면서,
    # 처음으로 '텍스트가 있는 이벤트'를 찾으면 그거 하나만 반환
    for ev in reversed(events):
        content = getattr(ev, "content", None)
        if not content:
            continue

        parts = getattr(content, "parts", []) or []
        texts = []
        for part in parts:
            text = getattr(part, "text", None)
            if text:
                texts.append(text)

        if texts:
            # 마지막 에이전트의 발화만 반환
            return "\n\n".join(texts)

    # 혹시 몰라서: 아무 텍스트도 못 찾으면 기본값
    return "(응답 없음)"

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.session_id:
        return ChatResponse(reply="오류: 세션 ID가 없습니다.")

    # 1. 사용자 전용 Runner 가져오기
    my_runner = get_or_create_runner(req.session_id)
    
    try:
        ltm_context = load_all_memories(req.session_id)
        
        prompt_with_context = (
            f"{ltm_context}\n"
            f"-------------------------------\n"
            f"(현재 사용자 ID: {req.session_id})\n"
            f"User: {req.message}"
        )
        
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