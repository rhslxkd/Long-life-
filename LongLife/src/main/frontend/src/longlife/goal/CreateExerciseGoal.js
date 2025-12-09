import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function CreateExerciseGoal() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    const [exercise, setExercise] = useState([]);
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);

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
    }, []);


    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
        } else {
            setCat2([]);
        }
        setType2(""); // 초기화
        setExerciseList([]); // 초기화
    }, [type1, exercises]);

    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);

    const createExercise = async (data) => {
        try {
            const today = new Date();
            const start = new Date(data.startingDate);
            const end = new Date(data.completeDate);

            let status = "SCHEDULED"; // 기본값

            if (today < start) {
                status = "SCHEDULED";
            } else if (today >= start && today <= end) {
                status = "ONGOING";
            } else if (today > end) {
                status = "SUCCESS";
            }

            const payload = {
                ...data,
                status,
            };
            console.log(payload);
            await fetcher(`http://localhost:8080/api/exercise/createGoal`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            alert("생성 완료");
            navigate("/workout/exercise/goal");
        } catch (error) {
            console.error(error);
            alert("생성 실패");
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
                marginTop: "30px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <form
                onSubmit={handleSubmit((data) => {
                    if (type1 === "무산소") {
                        data.distanceGoal = null;
                        data.timeGoal = null;
                    }
                    if (type1 === "유산소") {
                        data.weightGoal = null;
                        data.countGoal = null;
                    }

                    const today = new Date();
                    const start = new Date(data.startingDate);
                    const end = new Date(data.completeDate);

                    let status = "SCHEDULED";
                    if (today < start) status = "SCHEDULED";
                    else if (today >= start && today <= end) status = "ONGOING";
                    else if (today > end) status = "SUCCESS";

                    const payload = {...data, status};
                    createExercise(payload);
                })}
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
                    운동목표 추가하기
                </h1>

                {/* 운동 선택 박스 3개 가로 배치 */}
                <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>운동 유형</label>
                        <select
                            value={type1}
                            onChange={(e) => setType1(e.target.value)}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        >
                            <option value="">운동 유형 선택</option>
                            {cat1.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>운동 분류</label>
                        <select
                            value={type2}
                            onChange={(e) => setType2(e.target.value)}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        >
                            <option value="">운동 분류 선택</option>
                            {cat2.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>운동</label>
                        <select
                            {...register("name", {required: true})}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        >
                            <option value="">운동 선택</option>
                            {exerciseList.map((ex, i) => (
                                <option key={i} value={ex.name}>{ex.name}</option>
                            ))}
                        </select>
                        {errors.exerciseName && (
                            <p style={{color: "red", fontSize: "12px"}}>운동을 선택해주세요.</p>
                        )}
                    </div>
                </div>

                {/* 무게/개수 목표 2개 가로 배치 */}
                <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>무게 목표</label>
                        <input
                            type="number"
                            disabled={type1 === "유산소"}
                            {...register("weightGoal", {
                                required: type1 === "무산소" ? "무게 목표를 입력하세요." : false
                            })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "유산소" ? "#e0e0e0" : "#fff"
                            }}
                        />
                        {errors.weightGoal && <small style={{color:"red"}}>{errors.weightGoal.message}</small>}
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>개수 목표</label>
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
                            disabled={type1 === "무산소"}
                            {...register("distanceGoal")}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                backgroundColor: type1 === "무산소" ? "#e0e0e0" : "#fff"
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
                            {...register("startingDate", {required: "시작일을 입력하세요."})}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        />
                        {errors.startingDate && <small style={{color: "red"}}>{errors.startingDate.message}</small>}
                    </div>

                    <div style={{flex: 1, display: "flex", flexDirection: "column", gap: "6px"}}>
                        <label style={{fontWeight: "600", color: "#333"}}>완료 예정일</label>
                        <input
                            type="date"
                            {...register("completeDate", {required: "완료일을 입력하세요."})}
                            style={{padding: "10px", borderRadius: "6px", border: "1px solid #007bff"}}
                        />
                        {errors.completeDate && <small style={{color: "red"}}>{errors.completeDate.message}</small>}
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div style={{display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px"}}>
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
                        추가하기
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