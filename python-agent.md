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

## 🙋 작업내용 (포트폴리오 핵심)
* 영역	상세 내용
- AI Agent 설계	Gemini 기반 피트니스 코치 튜닝, instruction 설계
- Backend	Spring ↔ FastAPI ↔ ADK 전체 파이프라인 구현
- 프록시 서버	RestTemplate + Jackson(JSON 파싱) 구성
- Frontend	React UI /chat 구성 및 실시간 통신 구현
- 시스템 설계	전체 멀티서비스 아키텍처 직접 설계 및 통합
- GitHub관리 및 branch전략 수립.

## 📅 추후 계획 (기술 중심 고도화 로드맵)

본 AI 기능은 현재 단일 Agent 기반 운동 추천과 간단한 대화 기능을 제공하는 MVP 단계이며,  
향후에는 다음과 같은 기술적 확장을 통해 “전문 Coach AI 플랫폼”으로 발전시킬 계획입니다.

---

### 1. 전역 UI로 동작하는 AI Floating Widget 구현
현재는 `/chat` 페이지에서만 AI 챗 UI가 제공되지만,  
앞으로는 **전 페이지에서 공통으로 떠 있는 Floating AI Widget**을 구현할 예정입니다.  
React Portal 및 전역 상태 관리(Recoil/Zustand)를 활용해  
작은 아이콘 클릭 시 언제든지 챗 패널이 열리도록 하여  
서비스 전체를 관통하는 “상시 접근형 AI 비서 경험”을 제공할 계획입니다.

---

### 2. Session / Memory 기반 “개인 맞춤형 코치 AI” 구축  
Google ADK의 **Session / Memory API 설계 원칙**을 참고하여  
사용자의 운동 기록, 빈도, 근력 수준, 신체 부위별 강도, 식습관 등  
실제 사용자 데이터를 기반으로 **지속적으로 학습하는 개인 챗봇**을 구축할 예정입니다.

- ADK 세션 구조를 이용하여 개별 사용자 상태를 지속적으로 기억  
- 인증을 위해 AWT 기반 토큰 전략 적용  
- 장기적 맥락을 유지하여 “보디 프로필 준비 6주 플랜”과 같은  
  **장기 목표 기반 코칭 모델** 제공

이를 통해 단순 Q&A를 넘어서  
**“나만의 PT 트레이너” 경험**을 실현하는 것을 목표로 합니다.

---

### 3. VectorDB(Qdrant / MariaDB Vector) 기반 전문 운동지식 구축  
현재는 google search tool 기반으로 외부 지식을 가져오지만,  
향후에는 운동 백과/논문/전문 트레이닝 데이터를 정제하여  
**VectorDB (Qdrant 또는 MariaDB Vector)** 형태로 구축할 계획입니다.

- 운동별 목적(근비대/근지구력), 부위별 위험 요소, 벤치프레스 기전 등  
  전문적인 운동 지식 임베딩
- ADK Tool로 Vector Retrieval 시스템 연결
- LLM이 “검색 기반 답변”이 아니라  
  **전문 트레이너 수준의 내부 지식 기반 답변**을 생성하도록 업그레이드

이는 Agent Quality 문서에서 강조하는  
**Retrieval Integration · Trustworthiness 향상** 원칙에 따라  
AI 응답의 정확도를 현저히 높이는 방향입니다.

---

### 4. 멀티-Agent Orchestration 설계  
현재는 단일 피트니스 코치 Agent만 존재하지만,  
추후에는 역할 기반 에이전트를 아래처럼 분리할 예정입니다.

- **부상 예방 Agent** (폼 체크, 스트레칭, 통증 패턴 분석)  
- **회복 관리 Agent** (수면·영양·회복 루틴)  
- **운동 처방 Agent** (근비대/감량/분할 루틴 생성)  
- **멘탈 코치 Agent** (동기부여·습관 형성 플래너)  

그리고 Google ADK의 **Router Agent / Tool Agent 구조**에 따라  
멀티-Agent 간 조율을 수행하는  
**Coordinator Agent**를 두어  
각 요청을 적절한 전문 Agent에게 자동 라우팅할 계획입니다.

이 구조는 Prototype-to-Production 문서에 명시된  
**Scalable Agent Architecture**에 기반합니다.

---

### 5. AWS 기반 실제 서비스 배포 및 Auto-Scaling  
AI 서버(FastAPI)와 Spring Gateway를  
AWS EC2 또는 Lightsail에 배포하여  
실제 운영 환경에서의 안정성을 확보할 예정입니다.

- FastAPI → Docker 컨테이너화  
- Spring Boot → AWS 배포 + Nginx Reverse Proxy  
- React → S3 + CloudFront 정적 배포  
- 필요 시 GPU 기반 AI 서버로 확장 가능하도록 아키텍처 설계

장기적으로는 GitHub Actions를 이용한 **CI/CD 자동화 파이프라인**을 구성해  
Agent 업데이트와 벡터 DB 업데이트를 자동화할 계획입니다.

---

### 🎯 최종 목표
사용자 운동 기록 + VectorDB 지식 + Multi-Agent 코칭 + Session Memory  
이 네 요소를 결합하여  
**전문 트레이너 수준의 “라이브 AI 퍼스널 코치” 플랫폼**으로 발전시키는 것입니다.

## 이후 진행
![alt text](image.png)
세션 진행중,
![alt text](image-1.png)

이름을 기억함.