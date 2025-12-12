# test_db_connection.py
from database import get_db_connection
import sys

print("--- DB 접속 테스트 시작 ---")
try:
    conn = get_db_connection()
    print("✅ 1. 연결 객체 생성 성공")
    
    with conn.cursor() as cursor:
        print("⏳ 2. 쿼리 전송 중...")
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"✅ 3. 응답 수신 성공: {result}")
        print("🎉 DB 연결 완벽함! 에이전트 문제 아님.")
        
except Exception as e:
    print("\n[🚨 치명적 오류 발생]")
    print(f"에러 메시지: {e}")
    print("\n[진단]")
    print("1. AWS RDS라면 '보안 그룹(Security Group)'에서 '인바운드 규칙'에")
    print("   내 IP(0.0.0.0/0)와 포트 3306이 열려있는지 확인해.")
    print("2. .env 파일의 HOST, USER, PASSWORD가 진짜 맞는지 확인해.")
finally:
    if 'conn' in locals(): conn.close()