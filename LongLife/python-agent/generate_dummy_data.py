import pandas as pd
import random
import os

# ==========================================
# 1. 설정 및 폴더 준비
# ==========================================
FITNESS_DIR = "./data/fitness"
DIET_DIR = "./data/diet"

os.makedirs(FITNESS_DIR, exist_ok=True)
os.makedirs(DIET_DIR, exist_ok=True)

print("데이터 생성 시작! (각 1,000개 항목)")

# ==========================================
# 2. 운동 데이터 생성 로직 (Combinatorics)
# ==========================================
def generate_fitness_data(count=1000):
    body_parts = ["가슴", "등", "하체", "어깨", "팔(이두)", "팔(삼두)", "복근", "전신"]
    equipments = ["바벨", "덤벨", "케이블", "머신", "맨몸", "밴드", "케틀벨"]
    actions = ["프레스", "로우", "컬", "익스텐션", "스쿼트", "런지", "플라이", "크런치", "플랭크", "데드리프트"]
    difficulties = ["초급", "중급", "상급"]
    
    data = []
    
    for _ in range(count):
        part = random.choice(body_parts)
        equip = random.choice(equipments)
        action = random.choice(actions)
        diff = random.choice(difficulties)
        
        # 이름 조합 (예: 바벨 가슴 프레스)
        name = f"{equip} {part} {action}"
        
        # 설명 자동 생성
        desc = f"{part} 근육 발달에 좋은 {equip} 운동입니다. {diff}자에게 추천하며, 코어에 힘을 주고 수행하세요."
        caution = "허리가 꺾이지 않도록 주의하고, 통증이 있으면 중단하세요."
        
        data.append({
            "운동명": name,
            "부위": part,
            "장비": equip,
            "난이도": diff,
            "설명": desc,
            "주의사항": caution
        })
        
    df = pd.DataFrame(data)
    save_path = os.path.join(FITNESS_DIR, "dummy_workout_1000.xlsx")
    df.to_excel(save_path, index=False)
    print(f"운동 데이터 생성 완료: {save_path}")

# ==========================================
# 3. 식단 데이터 생성 로직
# ==========================================
def generate_diet_data(count=1000):
    proteins = ["닭가슴살", "소고기 우둔살", "연어", "두부", "계란 흰자", "틸라피아", "돼지 안심"]
    carbs = ["현미밥", "고구마", "단호박", "오트밀", "통밀빵", "바나나"]
    veggies = ["브로콜리", "양상추", "시금치", "파프리카", "방울토마토", "아스파라거스"]
    methods = ["구운", "삶은", "쪄낸", "볶은", "생으로 먹는"]
    
    data = []
    
    for _ in range(count):
        prot = random.choice(proteins)
        carb = random.choice(carbs)
        veg = random.choice(veggies)
        method = random.choice(methods)
        
        # 메뉴 이름 조합 (예: 구운 닭가슴살과 현미밥)
        menu_name = f"{method} {prot}과 {carb}, {veg} 샐러드"
        
        # 영양소 랜덤 생성 (현실적인 범위 내)
        kcal = random.randint(300, 800)
        protein_g = random.randint(20, 50)
        carb_g = random.randint(30, 80)
        fat_g = random.randint(5, 20)
        
        desc = f"탄수화물 {carb_g}g, 단백질 {protein_g}g이 포함된 균형 잡힌 식단입니다. {prot}의 풍미가 좋습니다."
        
        data.append({
            "식단명": menu_name,
            "칼로리": f"{kcal}kcal",
            "탄수화물": f"{carb_g}g",
            "단백질": f"{protein_g}g",
            "지방": f"{fat_g}g",
            "재료": f"{prot}, {carb}, {veg}",
            "설명": desc
        })
        
    df = pd.DataFrame(data)
    save_path = os.path.join(DIET_DIR, "dummy_diet_1000.xlsx")
    df.to_excel(save_path, index=False)
    print(f"식단 데이터 생성 완료: {save_path}")

# ==========================================
# 4. 실행
# ==========================================
if __name__ == "__main__":
    generate_fitness_data(1000)
    generate_diet_data(1000)
    print("\n모든 데이터 준비 끝! 이제 rag_tool.py를 실행해서 DB에 넣으세요.")