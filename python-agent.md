# 🚀 Longlife AI 구현 — AI 피트니스 코치 통합 브랜치

> 💡 이 문서는 `feature-pythonAgent` 브랜치 전용으로, AI 기반 피트니스 기능 통합 내용을 다룹니다.  
> 📂 포트폴리오 제출용입니다.
> main에 완벽한 코드를 올리지 못해 branch 링크로 전송합니다.

---

## 🧠 프로젝트 개요

**Longlife AI**는 Gemini 기반 LLM을 활용하여  
사용자의 건강 목표에 맞춘 **운동 루틴**, **요약**, **주의사항**을 제공하는  
멀티서비스 AI 피트니스 코치 시스템입니다.

> ✅ React · Spring Boot · FastAPI · Google ADK(Gemini) 기반 풀스택 AI 아키텍처

---

## 🔧 핵심 기능 요약

### ✔ 웹 Reat(UI)
- `/chat` 페이지에서 대화형 피트니스 코치 제공
- 실시간 Gemini 응답 렌더링

### ✔ Spring Boot API Gateway
- FastAPI와 통신하는 프록시 컨트롤러
- JSON 파싱, 인증 유지, CORS 처리 포함

### ✔ FastAPI + Google ADK
- Gemini 2.5 Flash Lite 기반 운동 루틴 생성
- Google Search Tool로 최신 정보 검색 보완 (MCP)
- InMemoryRunner 기반 단일 턴 에이전트 설계

---

## 🏗 아키텍처 구조

```plaintext
[React UI] (port: 3000)
   |
   | POST http://localhost:8080/api/ai/chat
   ▼
[Spring Boot - AiProxyController] (port: 8080)
   |
   | RestTemplate 전송
   ▼
http://localhost:8000/chat
   ▼
[FastAPI - python-agent] (port: 8000)
   |
   ▼
Google ADK InMemoryRunner → Gemini 2.5
```

대답은 역순!

> Spring Boot는 단순 중계가 아닌 **API Gateway**로 동작하며  
> 응답 가공, JSON 추출, 인증 및 보안 처리까지 수행합니다.

---

## 🤖 Agent 설계

- 역할: **한국인 대상 피트니스 코치**
- 응답 형식:
  1. 요약 한 문장  
  2. 운동 루틴 (표 형식)  
  3. 주의사항 2~3개  
- 특징:
  - 스파르타 코치 설정부여
  - 건강 정보 부족 시 "모른다"고 답변
  - 질병/통증 관련 시 전문의 상담 권유
  - Google Search 도구로 최신 정보 검증
 
```bash
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
```

---

## ⚙ 실행 방법

### 1️⃣ FastAPI 서버 실행
```bash
cd python-agent
venv\Scripts\activate  -> 가상환경을 통해 충돌 최소화.
uvicorn app:app --reload --port 8000
2️⃣ Spring Boot 실행
bash
Run!
3️⃣ React 앱 실행
경로를 frontend에 맞춘 후,
```bash
cd src/main .....
npm start
```
### 🧪 테스트 방법
1. ARC에서 FastAPI와 SpringBoot의 연결이 됐는지 확인
   <img width="1195" height="857" alt="image" src="https://github.com/user-attachments/assets/74635870-7cdf-4077-8fcb-292cfc1cd312" />
2. React와도 연결 완료되면, npm start를 통해 싸이트를 열고 직접 테스트
   <img width="1322" height="955" alt="image" src="https://github.com/user-attachments/assets/ac5bbfb8-fb64-4721-a6b0-8c775627d5e8" />

예시 입력: 워밍업 운동추천해줘

기대 출력: 요약 + 표 형식 루틴 + 주의사항 + 스파르타식 성격

## 🙋 기여한 작업 (포트폴리오 핵심)
* 영역	상세 내용
- AI Agent 설계	Gemini 기반 피트니스 코치 튜닝, instruction 설계
- Backend	Spring ↔ FastAPI ↔ ADK 전체 파이프라인 구현
- 프록시 서버	RestTemplate + Jackson(JSON 파싱) 구성
- Frontend	React UI /chat 구성 및 실시간 통신 구현
- 시스템 설계	전체 멀티서비스 아키텍처 직접 설계 및 통합
- GitHub관리 및 branch전략 수립.

## 📌 성과 및 의미
- 🧩 실제 작동하는 LLM 기반 피트니스 코치 완성

- 💬 단순 텍스트 생성이 아닌 Agent 기반 설계 경험 보유

- 🔍 검색 도구 연계 포함한 멀티도구 AI 시스템 실습

- 🌐 AI 기술을 실질적 웹 서비스로 통합한 포트폴리오 구성

## 👨‍👩‍👧‍👦 대상 사용자
"100세 시대, 남녀노소 모두를 위한 AI 건강 파트너"

운동 초보자부터 시니어까지
모든 연령과 목적에 맞는 맞춤형 피트니스 루틴 제공
