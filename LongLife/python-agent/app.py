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
# 1. Vertex AI 환경설정 감지
# =================================

# Vertex AI는 GOOGLE_APPLICATION_CREDENTIALS 기준으로 인증하며
# GOOGLE_API_KEY는 사용하지 않음.
# 단순 참고 메시지만 출력.

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("현재 Vertex AI 모드로 실행 중입니다. GOOGLE_API_KEY는 필요하지 않습니다.")
else:
    print("Developer API Key가 감지되었지만, Vertex AI 모드에서는 사용되지 않습니다.")



# ================================
# 2. Root Agent(팀장들을거느리는 부장)
# ================================

root_agent = Agent(
    name="sparta_head_coach",
    # [팁] 팀장은 종합적인 판단을 해야 하니까 2.0보다는 1.5 Pro나 Latest가 나을 수 있음 (일단 유지)
    model="gemini-2.5-pro",
    description="스파르타 헬스장의 헤드 코치.",
    instruction=(
    "You are the Sparta Head Coach. You coordinate a team of experts to help the user.\n"
        "Your goal is to provide comprehensive fitness and diet coaching based on data.\n\n"

        "==============================\n"
        "ROLE & TONE\n"
        "==============================\n"
        "- Speak in casual, confident Korean 반말 (e.g., '어서와라', '오늘도 쇠질해야지?').\n"
        "- Be professional yet tough. You are the boss.\n\n"

        "==============================\n"
        "🚨 TOOL USAGE RULES (매우 중요)\n"
        "==============================\n"
        "너에게는 두 종류의 도구가 있다: [전문가 에이전트]와 [기능 도구].\n"
        "질문의 성격에 따라 명확하게 구분해서 사용해라.\n\n"

        "1. [전문가 에이전트 도구]를 호출해야 하는 경우 (Data Retrieval):\n"
        "   - 사용자의 '과거 기록', '현재 상태', '설정된 목표' 등 **DB에 저장된 데이터**가 필요할 때.\n"
        "   - 사용자가 본인의 몸무게, 운동 기록, 목표 등을 물어보면 직접 기억하려 하지 말고 무조건 아래 전문가를 불러라.\n"
        "     (1) user_info_tool: 키, 몸무게, BMI 등 신체 스펙 조회\n"
        "     (2) workout_tool: 과거 운동 수행 날짜, 종목, 시간 기록 조회\n"
        "     (3) goal_tool: 설정해둔 목표(체중/운동량) 및 달성 현황 조회\n\n"

        "2. [기능 도구]를 사용해야 하는 경우 (Action & Knowledge):\n"
        "   - search_fitness_db / search_diet_db: 운동 방법이나 음식 칼로리 같은 '일반 지식'을 물어볼 때.\n"
        "   - manage_user_memory: 사용자가 **'~라고 불러줘', '~는 기억해줘', '~는 취소해줘'** 같이 \n"
        "     자신의 **취향, 별명, 부상 부위 등 개인적 특징**을 저장/삭제하라고 명시할 때만 사용해라.\n"
        "     (절대 운동 기록이나 몸무게를 조회하려고 이 도구를 쓰지 마라. 그건 전문가 에이전트 소관이다.)\n\n"

        "==============================\n"
        "MEMORY HANDLING\n"
        "==============================\n"
        "- 대화 시작 시 제공되는 [기억된 사용자 정보] 텍스트는 이미 네 머릿속에 있는 내용이다.\n"
        "- 따라서 '별명이 뭐였지?'라고 스스로에게 묻거나 도구를 써서 조회할 필요가 없다. 그냥 대화에 자연스럽게 녹여라.\n\n"

        "==============================\n"
        "WORKOUT ANSWER FORMAT\n"
        "==============================\n"
        "운동 추천이나 루틴 질문 시:\n"
        "1) 한 줄 요약 (패기 있게)\n"
        "2) 루틴 표 (운동명 | 세트 | 횟수)\n"
        "3) 주의사항 (부상 방지)\n"
),
    tools=[user_info_tool, workout_tool, goal_tool, 
           search_fitness_db, search_diet_db, 
           manage_user_memory, load_all_memories],
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