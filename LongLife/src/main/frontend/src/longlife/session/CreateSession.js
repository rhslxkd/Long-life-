import {useForm} from "react-hook-form";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CreateSession() {
    const {formDate: date} = useParams();
    const users = useMe();
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

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


    const createSession = async (data) => {
        const {exerciseName, note, location, startedAt, endedAt} = data;
        const id = users?.id;

        // 전달받은 날짜 (예: "2025-11-29")
        const baseDate = date;

        // 날짜와 시간 합치기
        const startedDateTime = `${baseDate}T${startedAt}`;
        const endedDateTime = `${baseDate}T${endedAt}`;

        const sessionData = {
            exerciseName,
            note,
            location,
            startedAt: startedDateTime,
            endedAt: endedDateTime,
            id
        };

        try {
            await fetcher("http://localhost:8080/api/workout/createSession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            });
            navigate(`/workout/session/${date}`);
        } catch (err) {
            console.error(err);
            alert("세션 생성 중 오류가 발생했습니다.");
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
            <h1
                style={{
                    marginBottom: "25px",
                    fontSize: "2rem",
                    fontWeight: "bold"
                }}
            >
                {date} 운동일지 추가하기
            </h1>

            <form
                onSubmit={handleSubmit(createSession)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >
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
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
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
                            {...register("exerciseName", { required: true })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        >
                            <option value="">운동 선택</option>
                            {exerciseList.map((ex, i) => (
                                <option key={i} value={ex.name}>{ex.name}</option>
                            ))}
                        </select>
                        {errors.exerciseName && (
                            <p style={{ color: "red", fontSize: "12px" }}>운동을 선택해주세요.</p>
                        )}
                    </div>
                </div>

                {/* 장소, 메모, 시간 입력 필드 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>장소</label>
                    <input
                        {...register("location")}
                        placeholder="운동 장소"
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none"
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>메모</label>
                    <textarea
                        {...register("note")}
                        placeholder="운동 메모"
                        rows={4}   // 박스 높이를 늘림
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none",
                            resize: "none"   // 크기 조절 핸들 제거 (선택)
                        }}
                    />
                </div>

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
                            {...register("startedAt", { required: true })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontWeight: "600", color: "#333" }}>종료 시간</label>
                        <input
                            type="time"
                            {...register("endedAt", { required: true })}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #007bff",
                                outline: "none"
                            }}
                        />
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
                        추가하기
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
                        뒤로가기
                    </button>
                </div>
            </form>
        </div>
    );


}
