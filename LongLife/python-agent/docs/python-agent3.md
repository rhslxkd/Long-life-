# 🧠 LongLife AI: Phase 3 - The Orchestrator Architecture

> **"단순한 협업을 넘어, 완벽한 지휘 체계로. 에이전트를 도구화(Agent-as-a-Tool)하여 일관된 페르소나를 완성하다."**

## 📌 Project Milestone
본 문서는 **LongLife AI 프로젝트**의 아키텍처가 **단일 에이전트 → 멀티 에이전트 → 오케스트레이터 패턴**으로 진화해 온 기술적 여정을 다룹니다.
특히, 하위 에이전트가 제각기 답변하는 문제를 해결하기 위해 **Root Agent 중심의 중앙 집중형 지휘 체계**를 확립한 과정을 중점적으로 기술합니다.

---

## 🏗️ Architecture Evolution (아키텍처 진화 과정)

### v1. Single Agent (초기 모델)
* **구조:** 하나의 거대 에이전트가 모든 도구(DB, 검색 등)를 직접 사용.
* **문제점:** 기능이 많아질수록 프롬프트가 복잡해지고, 역할 분담이 모호해짐.

### v2. Basic Multi-Agent (단순 팀 구조)
* **구조:** `sub_agents=[user_agent, workout_agent...]` 로 등록하여 사용.
* **문제점 (The Router Problem):**
    * Root Agent가 사용자의 질문을 듣고 "잠시만요, 트레이너 연결해 드릴게요"라며 대화를 하위 에이전트에게 넘겨버림(Routing).
    * 하위 에이전트가 직접 사용자에게 답변하면서 **Root Agent의 '스파르타 코치' 페르소나가 깨짐.**
    * 대화의 주도권이 분산되어 일관성 있는 코칭이 불가능함.

### v3. Orchestrator Pattern (최종 완성 - Agent as a Tool)
* **구조:** 하위 에이전트를 `sub_agents`가 아닌 **`tools`**로 등록 (`AgentTool` 래퍼 사용).
* **해결책:**
    * Root Agent는 하위 에이전트를 **"동료"가 아닌 "도구"**로 인식.
    * 사용자에게 대화를 넘기지 않고, **내부적으로 하위 에이전트를 호출하여 정보만 수집(Function Calling).**
    * 수집된 정보를 종합하여 **Root Agent가 직접** 스파르타 말투로 최종 답변 생성.

---

## 📐 Final Architecture Diagram

```mermaid
graph TD
    User((User)) -->|질문| Root[👑 Root Agent<br/>(오케스트레이터)]
    
    subgraph "Internal Tools Layer (Agent-as-a-Tool)"
        Root -- 도구 호출 --> UA_Tool[🛠️ AgentTool<br/>(User Info)]
        Root -- 도구 호출 --> WA_Tool[🛠️ AgentTool<br/>(Workout)]
        Root -- 도구 호출 --> GA_Tool[🛠️ AgentTool<br/>(Goal)]
        Root -- 도구 호출 --> SA_Tool[🛠️ AgentTool<br/>(Search)]
        
        UA_Tool -->|실행| UA[👤 User Agent]
        WA_Tool -->|실행| WA[🏋️ Workout Agent]
        GA_Tool -->|실행| GA[🎯 Goal Agent]
        SA_Tool -->|실행| SA[🔍 Search Agent]
    end

    subgraph "Data Sources"
        UA & WA & GA -.->|SQL| DB[(MariaDB)]
        SA -.->|API| Web[DuckDuckGo]
    end

    UA & WA & GA & SA -->|데이터 리턴| Root
    Root -->|종합 및 페르소나 적용| User
```
---
## 💻 Key Code Implementation
### 1. Agent-as-a-Tool Pattern
하위 에이전트를 AgentTool로 감싸서 Root Agent의 도구로 등록합니다.

```Python

# app.py
from google.adk.tools import AgentTool

# 에이전트를 도구화 (The 'Agent as a Tool' Pattern)
user_info_tool = AgentTool(agent=user_agent)
workout_tool = AgentTool(agent=workout_agent)
goal_tool = AgentTool(agent=goal_agent)
search_tool = AgentTool(agent=search_agent)

root_agent = Agent(
    name="sparta_head_coach",
    model="gemini-2.0-flash", 
    instruction="...하위 전문가(도구)들의 보고를 종합하여, 당신이 직접 반말로 강하게 조언하세요...",
    # sub_agents 대신 tools에 등록!
    tools=[user_info_tool, workout_tool, goal_tool, search_tool] 
)
```

### 2. Context Injection (프롬프트 주입)
도구 호출 시 필요한 user_id를 AI가 놓치지 않도록 시스템 프롬프트에 명시적으로 주입합니다.

```Python

@app.post("/chat")
async def chat(req: ChatRequest):
    # ...
    # 시스템 프롬프트 엔지니어링: 현재 사용자 정보를 자연어로 주입
    prompt_with_context = f"(현재 사용자ID: {req.session_id}) {req.message}"
    
    events = await my_runner.run_debug(prompt_with_context)
    # ...
```
---

## 🛠️ Troubleshooting Log
* 💥 Issue: Inconsistent Persona in Multi-Agent
- 상황: sub_agents 리스트를 사용했을 때, Root Agent가 답변을 생성하지 않고 하위 에이전트에게 대화 턴을 넘겨버림(Router 방식). 이로 인해 '스파르타 코치'의 말투가 유지되지 않고, 하위 에이전트의 딱딱한 보고 말투가 사용자에게 노출됨.

- 해결: Orchestrator 패턴 도입. 하위 에이전트를 AgentTool로 래핑하여 Root Agent가 이들을 함수처럼 호출하게 만듦. 결과적으로 사용자는 오직 Root Agent와만 대화하며 일관된 경험을 제공받음.

* 💥 Issue: Tool Use Failure with Lite Models
- 상황: gemini-2.5-flash-lite 모델 사용 시 도구 호출이 빈번하게 실패하거나 400 에러 발생.

- 해결: 도구 호출(Function Calling) 추론 능력이 검증된 gemini-2.0-flash (또는 1.5-flash-latest) 모델로 전면 교체하여 안정성 확보.

* 💥 Issue: 오우 마이 마이 금쪽이 google_search
- 상황: google_search기능이 다른 도구들과 합쳐지면 오류가남 하 ㅠㅠ.

- 해결: 과감히 버리고, 후에 VectorDB를 사용할 예정, gemini-2.0-flash로 버전업을 하여 그래도 답변이 신뢰성이 꽤 높음.

## 🔮 Future Roadmap
* RAG Integration: 단순 웹 검색(DuckDuckGo)을 넘어, 전문적인 운동학 논문 및 가이드를 벡터 DB에 구축하여 RAG 기반의 심층 조언 제공 예정.

* 현재에는 아직 InMemoryRunner라 서버를 껐다 키면 다 까먹음 -> 후에 MariaDB에 SessionTable을 만들어서 중요한 내용을 저장하여 찐찐찐 맞춤형 Agent가 되도록 할 예정.