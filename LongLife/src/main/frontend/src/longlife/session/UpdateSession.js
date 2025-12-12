import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "../../lib/fetcher";
import Session from "./Session";

export default function UpdateSession() {

    const {formDate: date} = useParams();
    const params = useParams();
    const navigate = useNavigate();
    const sessionId = params?.sessionId;
    const [session, setSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");

    const [err, setErr] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        watch
    } = useForm();

    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/workout/updateSession/${sessionId}`)
            console.log(data)
            setSession(data)
        })();
    }, []);

    useEffect(() => {
        if (session && exercises.length > 0) {
            // exerciseName으로 해당 운동 찾기
            const matched = exercises.find(e => e.name === session.exerciseName);

            if (matched) {
                setType1(matched.type1);
                setType2(matched.type2);
            }

            // 기존 값 세팅
            setValue("exerciseName", session.exerciseName);
            setValue("startedAt", session.startedAt?.slice(0, 16));
            setValue("endedAt", session.endedAt?.slice(0, 16));
            setValue("location", session.location);
            setValue("note", session.note);
        }
    }, [session, exercises, setValue]);

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
    }, [session]);

    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
            // 세션에서 이미 type2를 세팅한 경우에는 초기화하지 않음
            if (!session) {
                setType2("");
                setExerciseList([]);
            }
        } else {
            setCat2([]);
            setType2("");
            setExerciseList([]);
        }
    }, [type1, exercises, session]);


    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);


    const updateSession = async (data) => {
        try {
            await fetcher(`http://localhost:8080/api/workout/updateSession/${sessionId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            alert("운동일지가 수정되었습니다.");
            navigate(`/workout/session/${date}`);
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
                marginTop: "30px",
                marginBottom: "30px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <form
                onSubmit={handleSubmit(updateSession)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >
                <h1
                    style={{
                        marginBottom: "25px",
                        fontSize: "2rem",
                        fontWeight: "bold"
                    }}
                >
                    {date} 운동일지 수정하기
                </h1>

                {/* 운동 기준 선택 박스 가로 배치 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "15px"
                    }}
                >
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동 유형</label>
                        <select
                            value={type1}
                            onChange={(e) => setType1(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        >
                            <option value="">운동 유형 선택</option>
                            {cat1.map((c, index) => (
                                <option key={index} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동 분류</label>
                        <select
                            value={type2}
                            onChange={(e) => setType2(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        >
                            <option value="">운동 분류 선택</option>
                            {cat2.map((c, index) => (
                                <option key={index} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>운동</label>
                        <select
                            {...register("exerciseName", { required: true })}
                            value={session?.exerciseName || ""}
                            onChange={(e) => setValue("exerciseName", e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        >
                            <option value="">운동 선택</option>
                            {exerciseList.map((exercise, index) => (
                                <option key={index} value={exercise.name}>{exercise.name}</option>
                            ))}
                        </select>
                        {errors.exerciseName && (
                            <p style={{ color: "red", fontSize: "12px" }}>운동을 선택해주세요.</p>
                        )}
                    </div>
                </div>

                {/* 메모 입력 박스 크게 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>메모</label>
                    <textarea
                        {...register("note")}
                        placeholder="운동 메모"
                        rows={4}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none",
                            resize: "none"
                        }}
                    />
                </div>

                {/* 장소 입력 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>장소</label>
                    <input
                        {...register("location", {
                            required: "장소 입력은 필수입니다.",
                            maxLength: { value: 255, message: "장소는 255자 이내로 입력바랍니다." }
                        })}
                        placeholder="운동 장소"
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none"
                        }}
                    />
                    {errors.location && (
                        <small role="alert" style={{ color: "red" }}>{errors.location.message}</small>
                    )}
                </div>

                {/* 시간 입력 가로 배치 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "15px"
                    }}
                >
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>시작 시간</label>
                        <input
                            type="time"
                            {...register("startedAt", { required: "시작 시간을 입력해주세요." })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        />
                        {errors.startedAt && (
                            <p style={{ color: "red" }}>{errors.startedAt.message}</p>
                        )}
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>종료 시간</label>
                        <input
                            type="time"
                            {...register("endedAt", {
                                required: "종료 시간을 입력해주세요.",
                                validate: (value) => {
                                    const start = watch("startedAt");
                                    return !start || value >= start || "종료 시간이 시작 시간보다 빠릅니다.";
                                }
                            })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        />
                        {errors.endedAt && (
                            <p style={{ color: "red" }}>{errors.endedAt.message}</p>
                        )}
                    </div>

                </div>

                {/* 버튼 영역 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginTop: "20px"
                    }}
                >
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
                        일지 수정
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/workout/session/${date}`)}
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
