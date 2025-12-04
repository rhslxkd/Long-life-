from database import get_db_connection

# ==========================================
# 1. UserAgent용 도구. (인사팀이죵)
# ==========================================

def get_my_health_info(user_id: str) -> str: #user_id: str은 이 함수를 호출할 때 user_id라는 이름표를 붙여서 분자열을 던져달라. java의 (String userId) -> str은 함수가 일을 다 끝내면 문자열을 뱉어낼 거다
    """
    MaraDB에서 Users Table에서 사용자의 개인 신체정보를 가져온다.
    """
    print(f"[tool] 건강 정보 조회: {user_id}")
    
    # try(시도)-with(자동관리)-except(수습)-finally(마무리) 4단계 프로세스
    # try(시도): 일단 이거 해봐하는 작업(에러가 날 수도 있음.)
    try: 
        # 이게 의미하는것. 1. pymysql라이브러리 가동, 2. connect()주문 접수, 3. 연결 객체 라는 실제 물건을 하나 딱 찍어냄(Dict), 4. 그 물건을 return으로 던져줌
        conn = get_db_connection() # conn은 변수명(내맘대루 가능) ()를 붙여줘야 실행이 돼 안붙이면 그냥 함수 자체를 conn변수에 담아버림
        
        #with: 빌린거 알아서 반납! 여기서는 conn.cursor as cursor이건데, :뒤의 문이 끝나면(return 되면) python이 자동으로 cursor.closer를 해줌 conn이 그 return을 받은거 -> 객체지향 pymysql = 리모컨 만드는 공장, database.py 공장에서 TV리모컨을 사서 받아서 사오는 심부름꾼, conn: 심부름 꾼이 갖다준 리모컨, tools.py 리모컨을 사용하는 나 -> 나는 리모컨 만드는법 몰라도 돼 이미 완성된거 가져왔음 이게 시발 객체지향프로그래밍이구나 1학년때 처 배운걸 3년 지나서 이해해버리는 나도 레전드네
        with conn.cursor() as cursor: # conn은 그저 전화선 연결(get_db_connection으로) -> cursor로 이제 DB와 대화 가능 
            sql = "SELECT name, height, weight FROM users WHERE user_id = %s"
            cursor.execute(sql, (user_id,)) #sql을 DB에 전송 execute는 전송버튼.
            row = cursor.fetchone() # 결과가 여러개일 수 있지만 한 줄(row만 가져오라) row는 변수명, fetchone()이 진짜 힘을 가진 코드.fetchone=한줄(row)만 가져와, fetchall=리스트([])로 다가져와
            
            if not row:
                return f"회원종보 없음(ID: {user_id})" # f는 자바 스크립트의 백틱(``)과 같은 기능. {변수넣기 쌉가능}
            
            #BMI 게산 로직
            name = row['name'] #name은 실제 DB에 존재하는 colum명이여야해
            h = row['height']
            w = row['weight']
            
            if h and w: # 키랑 몸무게 다 있으면 실행하겠다.
                bmi = w / ((h / 100) ** 2)
                status = "비만" if bmi >= 25 else "정상" if bmi >= 18.5 else "저체중"
                return f"[신체정보] 이름: {name}, 키: {h}cm, 몸무게: {w}Kg, BMI: {bmi:.1f} ({status})"
            
            return f"[신체 정보] 이름: {name}, (키/몸무게 없음)" # else같이 위의 키와 모무게 없으면 실행 안되고 딱 떨어져서 이걸 실행
        
    # except: 앗 사고났다! -> 프로그램이 뇌정지 오지않게 에러를 잡아서 로그를 찍거나 메시지 리턴하게끔 -> 죽더라도 임무는 다 하고 죽어라.
    except Exception as e: # try-except-finally = 예외처리 java = catch (Exception e) 잡은(except) 에러를 e라고 이름을 지음
        return f"시스템 에러: {e}" # 고대로 반환
    # finally: 성공하든 실패하든 이건 꼭 해(DB연결 끊기)
    finally: # 에러가 나든말든 이걸 실행하겠다
        if 'conn' in locals(): conn.close() # conn으로 할당된 함수 get_db_connection부터 폭망해버리면, 결국 여기까지 오게돼서 야 conn이 local(주머니)에 있냐? - false(아뇨) -> conn.close()안함 2차 에러 방지 이쓰면 닫아서 보안 업!
        
# ======================================
# 2. WorkoutSession Agent용 도구(트레이너)
# ======================================

def get_my_workout_session(user_id: str) -> str:
    """
    MariaDB에서 사용자의 운동 기록을 조회. (운동종목, 수행 날짜, 수행 횟수 등)
    """
    print(f"[tool] 운동 기록 조회: {user_id}")
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                SELECT started_at, ended_at, location, note
                FROM workout_session
                WHERE user_id = %s
                ORDER BY started_at DESC
            """
            cursor.execute(sql, (user_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return "최근 운동 기록이 없다. (운동좀 해라!@)"
            
            result = "[최근 운동기록]\n"
            for r in rows:
                start = r["started_at"]
                end = r["ended_at"]
                loc = r["location"] if r["location"] else "장소 미상"
                note = r["note"] if r["note"] else "메모 없음"
                
                result += (
                    f"- 시간: {start} ~ {end}\n"
                    f"  장소: {loc}\n"
                    f"  메모: {note}\n"
                )
            
            return result
    
    except Exception as e:
        return f"운동기록 조회 실패: {e}"
    
    finally:
        if "conn" in locals():
            conn.close()


# ==================================================
# 3. goal Agent용 도구(메니저)
# ==================================================

def get_my_goal(user_id: str) -> str:
    """
    MariaDB에서 exercise_goal + physical_goal 통합 목표 데이터를 조회한다.
    """
    print(f"[tool] 목표 조회: {user_id}")
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                (SELECT 
                    'exercise' AS goal_type,
                    weight_goal, NULL AS kg_goal, count_goal, distance_goal, time_goal, 
                    starting_date, complete_date, status, ai_recommendation
                FROM exercise_goal
                WHERE user_id = %s)
                
                UNION ALL
                
                (SELECT 
                    'physical' AS goal_type,
                    NULL AS weight_goal, kg_goal, NULL AS count_goal, NULL AS distance_goal, NULL AS time_goal,
                    starting_date, complete_date, status, NULL AS ai_recommendation
                FROM physical_goal
                WHERE user_id = %s)
                
                ORDER BY starting_date DESC
            """
            cursor.execute(sql, (user_id, user_id))
            rows = cursor.fetchall()
            
            if not rows:
                return "설정된 목표가 없다."
            
            result_text = "[나의 통합 목표 리스트]\n"
            
            for i, r in enumerate(rows, 1):
                # 날짜 포맷팅
                start = (
                    r["starting_date"].strftime("%Y-%m-%d")
                    if r["starting_date"]
                    else "-"
                )
                end = (
                    r["complete_date"].strftime("%Y-%m-%d")
                    if r["complete_date"]
                    else "-"
                )
                status_str = f"[{r['status']}] ({start} ~ {end})"
                
                if r["goal_type"] == "exercise":
                    details = []
                    if r["weight_goal"]:
                        details.append(f"중량: {r['weight_goal']}kg")
                    if r["kg_goal"]:
                        details.append(f"감량/증량: {r['kg_goal']}kg")
                    if r["count_goal"]:
                        details.append(f"횟수: {r['count_goal']}회")
                    if r["distance_goal"]:
                        details.append(f"거리: {r['distance_goal']}km")
                    if r["time_goal"]:
                        details.append(f"시간: {r['time_goal']}")
                    
                    content = ", ".join(details) if details else "세부 내용 없음"
                    ai_rec = (
                        f"\n   └ AI 코멘트: {r['ai_recommendation']}"
                        if r["ai_recommendation"]
                        else ""
                    )
                    
                    result_text += (
                        f"{i}. [운동] {status_str}\n"
                        f"   내용: {content}{ai_rec}\n"
                    )
                
                elif r["goal_type"] == "physical":
                    target = f"{r['kg_goal']}kg" if r["kg_goal"] else "미설정"
                    result_text += (
                        f"{i}. [신체] {status_str}\n"
                        f"   목표 체중: {target}\n"
                    )
            
            # 중요: for문 바깥에서 최종 문자열 반환
            return result_text
    
    except Exception as e:
        return f"목표 조회 실패: {e}"
    
    finally:
        if "conn" in locals():
            conn.close()