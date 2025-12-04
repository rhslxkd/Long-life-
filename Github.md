
# 📌 **Git 팀 프로젝트 필수 명령어 정리**

## 1️⃣ `git branch`

**설명:**  
현재 로컬에 존재하는 브랜치 목록을 보여준다.
자신이 어떤 브랜치 위에 있는지도 확인 가능.

**왜 쓰냐:**  
지금 무슨 브랜치에서 작업 중인지 모르면 *그게 사고의 시작*이다.

---

## 2️⃣ `git branch -a`

**설명:**  
로컬 + 원격(origin)의 모든 브랜치를 다 보여준다.

**왜 쓰냐:**  
GitHub에서 만든 브랜치가 로컬에 없을 때 이걸로 존재 유무를 확인한다.

---

## 3️⃣ `git status`

**설명:**  
현재 상태 출력  
- 수정된 파일  
- 스테이징 여부  
- 커밋 전인지  
- 머지 중인지  

**왜 쓰냐:**  
작업하기 전에 항상 해야 하는 "건강검진".  
여기서 이상 있으면 절대 merge/pull 하지 말 것.
계속계속 써주면서 확인 필수 !!

---

## 4️⃣ `git checkout 브랜치명`

**설명:**  
해당 브랜치로 이동.

**주의:**  
브랜치가 로컬에 없으면 오류 뜬다.  
그럴 때는:

```
git checkout -b feature/login origin/feature/login
```

---

## 5️⃣ `git fetch`

**설명 (중요):**  
원격(origin)에 있는 **최신 커밋과 브랜치 정보를 로컬로 가져오는 명령어**  
다만 **현재 내 작업 브랜치 코드는 전혀 바뀌지 않는다. (초기화 아님!)**


**왜 쓰냐:**  
- GitHub에서 새 브랜치 만들었는데 로컬에서 안 보일 때 -> 이런 상황 많아요! 계속해서 해줘야함!!
- 팀원이 push 했는데 checkout/pull이 안 먹을 때 

---

## 6️⃣ `git pull origin 브랜치명`

**설명:**  
원격 브랜치의 **코드를 받아와서 내 브랜치에 merge** 한다. 
→ 자기 작업 브랜치를 원격(origin)과 맞출 때는 `git pull origin 본인브랜치` 를 쓰시면 됩니다. 제가 초반에 잘못 알려드린거에요!
(dev 내용을 feature 브랜치에 반영할 때는 아래 `git merge origin/dev` 참고)


**주의:**  
작업 중인 파일이 있을 때 pull 하면 충돌 발생 가능. -> 이걸 피하기 위해선 commit or, stash. (밑에 설명 나와요!)

---

## 7️⃣ `git add .`

**설명:**  
변경된 파일 전체를 staging 영역으로 올림. -> 이거 하기 전/후로 git status로 저장할 내용 뭐가있는지 / 더는 없는지 확인 !! 꼭꼭!!

---

## 8️⃣ `git commit -m "메시지"`

**설명:**  
staging 된 파일을 하나의 "버전"으로 저장.   (대충 chore = 파일만 추가, feat = 코드추가 fix = 오류수정)
(로컬에만 저장됨)

---

## 9️⃣ `git push origin 브랜치명`

**설명:**  
로컬 커밋들을 GitHub로 올리는 명령어.
(커밋을 몇 번 했든 모두 저장됩니다. 전부 레포의 Activity/Commits에서 확인 가능합니다!)

push를 하면 **그동안 쌓인 모든 커밋이 origin에 올라가고**,  
브랜치는 항상 **가장 최신 커밋(마지막 스냅샷)** 을 가리키게 됩니다.


**중요:**  
- 항상 `origin feature/**` 로 push  
- dev, main 절대 직접푸시 금지 진짜진짜 짱 중요!!!! 완전 중요!!! 호로로로로로롤!!! 이것만 기억해라!!! 호롤롤ㄹ롤!1! 항상 "git branch"로 수시로 확인해주세요ㅎㅎ 언제든 저 부르셔도 됩니다.
 
---

## 🔟 `git merge origin/dev`

**설명:**  
내 브랜치(feature)에 dev 최신 내용을 합치는 명령어. -> 제가 알려준건 이거였지만, 저희는 이제 pull = 자기 작업하던 branch 최신화 할 때, merge는 자기 작업 branch push할 때 이 merge를 사용해서 버그 해결 후 push하시면 됩니다. (이 전엔 당연히 fetch 해야겠죠ㅎㅎ)


---

## 1️⃣1️⃣ - 1 `git stash`

**설명:**  
커밋하기 싫은 작업물을 “잠깐 숨기기”. -> 아직 commit 안한 내용이 숨겨져요! 사용하게되는 경우는 origin/dev를 merge해야할 때! 지금 작업중인 내용이 너무 더럽거나, status확인하고 add하고 commit하고 push하기 귀찮을 때 잠깐 숨긴 상태에서 merge진행하면 편합니다.

---

## 1️⃣1️⃣ - 2 `git stash pop`

**설명:**  
stash로 숨긴 내용이 다시 뿅! 하고 나타납니다. 한번 해보세요, 전혀 위험하지 않아요\
**다만**, dev를 merge한 뒤 `stash pop` 하면 가끔 충돌이 날 수 있으니  
`git status` 보면서 천천히 처리해주세요.


---

## 1️⃣2️⃣ `git reset --hard origin/브랜치명`

**설명:**  
로컬 변경사항 싹 버리고 origin 기준으로 초기화. -> 망해버렸을 때 ㅜㅜ 쓸일 없기를 ㅠㅠ

---

## 1️⃣3️⃣ `git log --oneline`

**설명:**  
커밋 히스토리를 한 줄씩 보기.

---

## 1️⃣4️⃣ `git switch 브랜치명`

checkout과 같은 기능.

---

## 1️⃣5️⃣ `git log --oneline`

이 전에 커밋내용의 주소를 볼 수 있음. enter나 space를 하면 밑으로 쭉쭉 더 나옴

---

## 1️⃣6️⃣ `git show 주소:파일경로`

ex: git show 217161c:LongLife/python-agent/app.py 
이렇게 하면 저 커밋했을 때의 내 app.py내용을 보고 복사할 수 있음.

---

# 🧩 팀플 필수 루틴 요약 - 위에 설명이랑 비교해보면서 흐름을 한번 이해해보세요!

## 1. 작업 시작 - 본인작업 브랜치!

```
git status
git fetch
git checkout feature/내브랜치
git pull origin feature/내브랜치
```

## 2. 작업 마치고 push할 때(본인 branch ㅎㅎ) push는 다른 branch에는 하면 안됩니다ㅎㅎ

```
git status
git add .
git status
git commit -m "내용"
git push origin feature/내브랜치
```

## 3. PR 만들기 전

```
git status
커밋할거 있음 커밋 하고 작업 브랜치에 push하세요! status했을때 깨끗해야함!
git fetch
git merge origin/dev
충돌 해결
git push (본인 작업중인 branch)
```

## 4. PR할 때
저 부르세요!!
---


