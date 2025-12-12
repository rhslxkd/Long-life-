import os
import pymysql # pymysql이라는 공구함(무궁무진한 기능이 있는 박스)을 내 테이블(이 database.py)에 가져오겠다.

def get_db_connection():
    """
    MariaDB 데이터베이스에 연결 하기위한 함수.
    모든 도구들은 DB에 접근해야할 때 이 함수를 호출해서 연결을 함.
    """
    
    db_pw = os.getenv("DB_PASSWORD")
    if not db_pw:
        raise ValueError("DB PASSWORD 환경변수가 설정되지 않았습니다.") # raise는 java의 thow처럼 비상!!!을 알리는거임. -> 비번 없으면 시도도 안하겠다.
    db_us = os.getenv("DB_USER")
    if not db_us:
        raise ValueError("DB USER가 환경변수로 설정되지 않았습니다.")
    
    return pymysql.connect( #이 값을 이 함수를 부른 애들에게 건내준다.)
        host = "localhost",
        user = db_us,
        password = db_pw,
        db = "longlife",
        charset = "utf8mb4", # 한글 안깨지게 하려고.
        cursorclass = pymysql.cursors.DictCursor # 데이터를 딕셔너리로 받기 (.은 경로를 찾아가는것. ~의 안에있는) DictCursor로 저장해서 이제 데이터가 [170, 70]이 아닌 {'height':170, 'weight':70}이런 형식으로 나오게 됨
    )