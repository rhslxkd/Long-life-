# agents.py
from google.adk.agents import Agent

#우리 이뿌니 도구들ㅎㅎ
from tools import get_my_health_info, get_my_workout_session, get_my_goal, search_web

# =================================
# 1. UserInfo Agent
# =================================

user_agent = Agent(
    name="user_info_specialist",
    model="gemini-2.0-flash",
    description="회원의 신체 정보를 담당하는 전문가.",
    instruction=(
        "당신은 헤드 코치에게 회원의 신체 정보를 보고하는 분석가입니다.\n"
        "1. [get_my_health_info] 도구로 키, 몸무게, BMI를 조회하세요.\n"
        "2. **[중요] 사용자에게 직접 말을 걸지 마세요.**\n"
        "3. 조회된 '팩트(Fact)'와 'BMI 상태(비만/정상 등)'만 간결하게 보고하세요.\n"
        "   - 예: '회원 ID: sora, 키 190cm, 체중 70kg, 저체중입니다.'"
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
        "당신은 헤드 코치에게 회원의 과거 기록을 보고하는 분석가입니다.\n"
        "1. [get_my_workout_session] 도구로 최근 운동 기록을 조회하세요.\n"
        "2. **[중요] 사용자에게 훈계하거나 조언하지 마세요.** 그건 헤드 코치의 역할입니다.\n"
        "3. 오직 '최근 언제, 무엇을 했는지' 팩트만 정리해서 보고하세요."
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
        "당신은 헤드 코치에게 회원의 목표를 보고하는 분석가입니다.\n"
        "1. [get_my_goal] 도구로 설정된 목표를 확인하세요.\n"
        "2. **[중요] 감정적인 말은 빼고 데이터만 보고하세요.**\n"
        "3. 목표 내용과 달성 현황만 요약해서 전달하세요."
    ),
    tools=[get_my_goal],
)

# ==========================================
# 4. Search Specialist (지식 담당)
# ==========================================
search_agent = Agent(
    name="workout_knowledge_expert",
    model="gemini-2.0-flash",
    description="운동 방법, 루틴, 최신 트렌드 등 일반적인 지식을 검색하는 전문가.",
    instruction=(
        "당신은 헤드 코치를 위한 운동 지식 연구원입니다.\n"
        "1. 요청받은 운동법이나 지식을 [search_web] 도구로 찾으세요.\n"
        "2. **[중요] 검색된 운동 방법, 루틴, 효과를 요약해서 헤드 코치에게 전달하세요.**\n"
        "3. 사용자에게 직접 인사하거나 대화하지 마세요."
    ),
    tools=[search_web],
)
