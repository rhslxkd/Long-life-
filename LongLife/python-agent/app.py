import os

from fastapi import FastAPI
from pydantic import BaseModel

from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.tools import google_search

# ======================
# 1. API 키 / 환경 설정
# ======================
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("환경변수 GOOGLE_API_KEY 가 설정되어 있지 않음")

os.environ["GOOGLE_API_KEY"] = api_key
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "FALSE"

# ======================
# 2. ADK Agent & Runner
# ======================
root_agent = Agent(
    name="fitness_coach_agent",
    model="gemini-2.5-flash-lite",
    description="Personal fitness coach that designs workout plans and gives exercise advice.",
    instruction=(
        "100세시대를 맞아 남녀노소 오래살거 건강하게 살자라는 모토를 가지고있으세요."
        "헬스, 체중 감량, 근육 증가, 생활 습관에 대해 구체적으로 조언하세요."
        "당신은 스파르타코치입니다. 배려와 이해를 하지마세요."
        "운동에 대해 질문이 나올 시 다음을 따르세요:\n"
        "1) 한 문장 요약\n"
        "2) 운동에 대한 설명, 운동 루틴을 운동 이름, 세트 * 횟수(또는 시간)를 표 형식으로 제시\n"
        "3) 주의사항 2~3개(부상방지, 휴식, 호흡 등)\n\n"
        "사용자가 건강 상태나 통증을 이야기하면 전문의 진료를 권유해야 합니다.\n"
        "모르거나 애매한 내용은 아는 척하지 말고, 일반적인 원칙만 설명합니다.\n"
        "최신 정보나 연구가 필요하면 Google Search 도구를 사용해 검증합니다."
    ),
    tools=[google_search],
)

runner = InMemoryRunner(agent=root_agent)

# ======================
# 3. FastAPI 서버
# ======================
app = FastAPI()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


def extract_text_from_events(events) -> str:
    """
    ADK Event 리스트에서 content.parts[].text만 뽑아서 합쳐주는 함수
    """
    texts: list[str] = []

    # run_debug 결과가 list[Event] 라는 가정
    for ev in events:
        content = getattr(ev, "content", None)
        if not content:
            continue

        parts = getattr(content, "parts", []) or []
        for part in parts:
            text = getattr(part, "text", None)
            if text:
                texts.append(text)

    if texts:
        return "\n\n".join(texts)

    # 혹시라도 아무 텍스트 못 찾으면 디버그용으로 통째로 문자열화
    return str(events)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # 1) ADK 한 턴 실행 (디버깅용 러너)
    events = await runner.run_debug(req.message)

    # 2) 사람이 읽을 수 있는 텍스트만 추출
    reply_text = extract_text_from_events(events)

    # 3) 깔끔한 JSON으로 반환
    return ChatResponse(reply=reply_text)
