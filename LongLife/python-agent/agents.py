# agents.py
from google.adk.agents import Agent
from google.adk.tools import google_search

#우리 이뿌니 도구들ㅎㅎ
from tools import get_my_health_info, get_my_workout_session, get_my_goal

# =================================
# 1. UserInfo Agent
# =================================

user_agent = Agent(
    name="user_info_specialist",
    model="gemini-2.5-flash-lite",
    description="회원의 신체 정보를 담당하는 전문가.",
    instruction=(
        "당신은 회원의 개인 신체 정보를 관리하는 전문가입니다.\n"
        "1. [get_my_health_info] 도구를 사용해 회원의 키, 몸무게, BMI를 조회하세요.\n"
        "2. 조회된 데이터를 바탕으로 현재 상태(비만, 저체중 등)를 분석해 주세요.\n"
        "3. 분석 결과만 간결하게 보고하세요. (예: '회원님은 현재 비만입니다.')\n"
        "4. 도구 사용 시 user_id는 프롬프트에서 전달받은 값을 사용하세요."
    ),
    tools=[get_my_health_info],
)

# ==========================================
# 2. Workout History Manager (트레이너)
# ==========================================
workout_agent = Agent(
    name="workout_history_manager",
    model="gemini-2.0-flash",
    description="회원의 과거 운동 기록을 관리하는 전문가.",
    instruction=(
        "당신은 회원의 운동 기록을 관리하는 트레이너입니다.\n"
        "1. [get_my_workout_session] 도구를 사용해 회원이 언제, 어떤 운동을 했는지 확인하세요.\n"
        "2. 운동 빈도나 강도를 분석해서 피드백을 주세요. (예: '최근 운동을 너무 안 하셨군요.')\n"
    ),
    tools=[get_my_workout_session],
)

# ==========================================
# 3. Goal Manager (목표 관리자)
# ==========================================
goal_agent = Agent(
    name="goal_manager",
    model="gemini-2.0-flash",
    description="회원의 운동 목표를 관리하는 전문가.",
    instruction=(
        "당신은 회원의 목표 달성을 돕는 매니저입니다.\n"
        "1. [get_my_goal] 도구를 사용해 회원의 장단기 목표를 확인하세요.\n"
        "2. 목표 달성 여부를 체크하고, 동기부여를 해주세요.\n"
    ),
    tools=[get_my_goal],
)

# ==========================================
# 4. Search Specialist (지식 담당)
# ==========================================
search_agent = Agent(
    name="workout_knowledge_expert",
    model="gemini-2.5-flash-lite",
    description="운동 방법, 루틴, 최신 트렌드 등 일반적인 지식을 검색하는 전문가.",
    instruction=(
        "당신은 운동 지식 백과사전입니다.\n"
        "1. 사용자가 특정 운동법이나 지식을 물어보면 [google_search]를 사용해 정확한 정보를 찾으세요.\n"
        "2. 초보자도 이해하기 쉽게 설명하세요."
    ),
    tools=[google_search],
)
