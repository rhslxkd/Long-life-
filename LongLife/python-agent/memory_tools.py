from database import get_db_connection

# 1. 시스템용: 채팅 시작할 때 기억 몽땅 불러오는 함수 (LLM 도구 아님, 그냥 함수)
def load_all_memories(user_id: str) -> str:
    """
    DB에서 해당 유저의 모든 기억(Key-Value)을 가져와서 문자열로 반환.
    프롬프트에 주입(Injection)하는 용도.
    """
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = "SELECT memory_key, memory_value FROM user_memory WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return "" # 기억이 없으면 빈 문자열
            
            # "nickname: 미친놈, injury: 무릎 아픔" 형태로 변환
            memory_list = [f"{row['memory_key']}: {row['memory_value']}" for row in rows]
            return "\n[기억된 사용자 정보]\n" + "\n".join(memory_list) + "\n"
            
    except Exception as e:
        print(f"메모리 로드 실패: {e}")
        return ""
    finally:
        if 'conn' in locals(): conn.close()

# 2. 에이전트용 도구: 기억을 저장/수정/삭제하는 함수
def manage_user_memory(user_id: str, action: str, key: str, value: str = "") -> str:
    """
    사용자의 요청에 따라 기억을 저장하거나 삭제한다.
    
    Args:
        user_id: 사용자 ID (자동 주입)
        action: 'save' (저장/수정) 또는 'delete' (삭제)
        key: 기억할 항목의 이름 (예: 'nickname', 'dislike_food')
        value: 기억할 내용 ('save'일 때만 필수. 예: '오이', '왕자님')
    """
    print(f"[tool] 메모리 관리: {action} - {key}={value}")
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            if action == "save":
                # UPSERT 구문 (있으면 업데이트, 없으면 삽입) - MariaDB/MySQL 문법
                sql = """
                    INSERT INTO user_memory (user_id, memory_key, memory_value)
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE memory_value = %s
                """
                cursor.execute(sql, (user_id, key, value, value))
                conn.commit()
                return f"메모리 저장 완료: {key} = {value}"
            
            elif action == "delete":
                sql = "DELETE FROM user_memory WHERE user_id = %s AND memory_key = %s"
                cursor.execute(sql, (user_id, key))
                conn.commit()
                return f"메모리 삭제 완료: {key}"
            
            else:
                return "알 수 없는 명령입니다. 'save' 또는 'delete'만 가능합니다."
                
    except Exception as e:
        return f"메모리 작업 실패: {e}"
    finally:
        if 'conn' in locals(): conn.close()