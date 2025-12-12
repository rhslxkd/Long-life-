import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function UpdateExerciseGoal() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        watch
    } = useForm();

    const navigate = useNavigate();
    const {id: exerciseGoalId} = useParams();

    const [exerciseGoal, setExerciseGoal] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);

    // ✅ 운동목표 상세 조회
    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/exercise/goal/${exerciseGoalId}`);
            setExerciseGoal(data);
        })();
    }, []);


    // ✅ 운동목표 데이터 form에 세팅 + 운동 분류 자동 선택
    useEffect(() => {
        if (exerciseGoal && exercises.length > 0) {

            // 운동 이름으로 운동 정보 찾기
            const matched = exercises.find(e => e.name === exerciseGoal.name);

            if (matched) {
                setType1(matched.type1);
                setType2(matched.type2);
            }
            // form 값 세팅
            setValue("name", exerciseGoal.name);
            setValue("weightGoal", exerciseGoal.weightGoal);
            setValue("countGoal", exerciseGoal.countGoal);
            setValue("distanceGoal", exerciseGoal.distanceGoal);
            setValue("timeGoal", exerciseGoal.timeGoal);
            setValue("startingDate", exerciseGoal.startingDate);
            setValue("completeDate", exerciseGoal.completeDate);
        }
    }, [exerciseGoal, exercises, setValue]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher('http://localhost:8080/api/exercise');
                setExercises(data);
                // 카테고리1 고정을 위해 처음에 랜더링 시 한번만
                setCat1([...new Set(data.map((e) => e.type1))]);
            } catch (e) {
                setErr(e.message);
            }
        })();
    }, [exerciseGoal]);

    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
            // 세션에서 이미 type2를 세팅한 경우에는 초기화하지 않음
            if (!exerciseGoal) {
                setType2("");
                setExerciseList([]);
            }
        } else {
            setCat2([]);
            setType2("");
            setExerciseList([]);
        }
    }, [type1, exercises, exerciseGoal]);

    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);

    // type1 변경 시 관련 없는 필드 초기화
    useEffect(() => {
        if (type2 === "구기종목") {
            setValue("distanceGoal", null);
            if(type1 === "무산소"){
                setValue("timeGoal", null);
            }
        }
        if (type2 === "복근") {
            setValue("weightGoal", null);
            if(type1 === "유산소"){
                setValue("countGoal", null);
            }
        }
    }, [type1, type2, setValue]);


    // ✅ 업데이트 요청
    const updateExercise = async (data) => {
        try {
            if (type1 === "무산소") {
                data.distanceGoal = null;
                data.timeGoal = null;
                if (type2 === "복근") {
                    data.weightGoal = null;
                }
            }
            if (type1 === "유산소") {
                data.weightGoal = null;
                data.countGoal = null;
                if (type2 === "구기종목") {
                    data.distanceGoal = null;
                }
            }

            const today = new Date();
            const start = new Date(data.startingDate);
            const end = new Date(data.completeDate);

            let status = "SCHEDULED";
            if (today >= start && today <= end) status = "ONGOING";
            if (today > end) status = "SUCCESS"; // 실패 조건 추가 가능

            const payload = { ...data, status };

            await fetcher(`http://localhost:8080/api/exercise/updateGoal/${exerciseGoalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            alert("수정 완료");
            navigate("/workout/exercise/goal");
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                maxWidth: "700px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <form
                onSubmit={handleSubmit(updateExercise)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >
                <h1
                    style={{
                        marginBottom: "10px",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    운동목표 수정하기
                </h1>

                {/* 운동 선택 박스 3개 가로 배치 */}
                <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동 유형</label>
                        <select
                            value={type1}
                            onChange={(e) => setType1(e.target.value)}
                            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #007bff" }}
                        >
                            <option value="">운동 유형 선택</option>
                            {cat1.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동 분류</label>
                        <select
                            value={type2}
                            onChange={(e) => setType2(e.target.value)}
                            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #007bff" }}
                        >
                            <option value="">운동 분류 선택</option>
                            {cat2.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동</label>
                        <select
                            {...register("name", { required: true })}
                            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #007bff" }}
                        >
                            <option value="">운동 선택</option>
                            {exerciseList.map((e, i) => (
                                <option key={i} value={e.name}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 무게/개수 목표 2개 가로 배치 */}
                <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>무게 목표(kg)</label>
                        <input
                            type="number"
                            disabled={type1 === "유산소" || type2 === "복근"}
                            {...register("weightGoal", {
                                required: type1 === "무산소" ? "무게 목표를 입력하세요." : false
                            })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "유산소" || type2 === "복근" ? "#e0e0e0" : "#fff"
                            }}
                        />
                        {errors.weightGoal && <small style={{color:"red"}}>{errors.weightGoal.message}</small>}
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>개수 목표(개)</label>
                        <input
                            type="number"
                            disabled={type1 === "유산소"}
                            {...register("countGoal", {
                                required: type1 === "무산소" ? "개수 목표를 입력하세요." : false
                            })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "유산소" ? "#e0e0e0" : "#fff"
                            }}
                        />
                        {errors.countGoal && <small style={{color:"red"}}>{errors.countGoal.message}</small>}
                    </div>
                </div>

                {/* 거리/시간 목표 2개 가로 배치 */}
                <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>거리 목표</label>
                        <input
                            type="text"
                            disabled={type1 === "무산소" || type2 === "구기종목"}
                            {...register("distanceGoal")}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "무산소" || type2 === "구기종목" ? "#e0e0e0" : "#fff"
                            }}
                        />
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>시간 목표</label>
                        <input
                            type="text"
                            disabled={type1 === "무산소"}
                            {...register("timeGoal", {
                                required: type1 === "유산소" ? "시간 목표를 입력하세요." : false
                            })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "무산소" ? "#e0e0e0" : "#fff"
                            }}
                        />
                        {errors.timeGoal && <small style={{color:"red"}}>{errors.timeGoal.message}</small>}
                    </div>
                </div>


                {/* 시작일/완료 예정일 2개 가로 배치 */}
                <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>시작일</label>
                        <input
                            type="date"
                            {...register("startingDate", {
                                required: "시작일을 입력하세요."
                            })}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        />
                        {errors.startingDate && (
                            <small style={{color: "red"}}>{errors.startingDate.message}</small>
                        )}
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>완료 예정일</label>
                        <input
                            type="date"
                            {...register("completeDate", {
                                required: "완료일을 입력하세요.",
                                validate: (value) => {
                                    const start = watch("startingDate");
                                    return (
                                        !start ||
                                        value >= start ||
                                        "완료 예정일은 시작일보다 빠를 수 없습니다."
                                    );
                                }
                            })}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        />
                        {errors.completeDate && (
                            <small style={{color: "red"}}>{errors.completeDate.message}</small>
                        )}
                    </div>
                </div>


                {/* 버튼 영역 */}
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
                    <button
                        type="submit"
                        style={{
                            padding: "12px 24px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold"
                        }}
                    >
                        수정하기
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/workout/exercise/goal")}
                        style={{
                            padding: "12px 24px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold"
                        }}
                    >
                        목록
                    </button>
                </div>
            </form>
        </div>
    );

}
