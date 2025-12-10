import React, {useState, useEffect} from "react";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

export default function ExerciseGoal() {

    const [exercise, setExercise] = useState([]);
    const navigate = useNavigate();

    const load = async () => {
        const data = await fetcher(`http://localhost:8080/api/exercise/goal`);
        setExercise(data ?? []);
    };

    useEffect(() => {
        (async () => {
            try{
                const data = await fetcher('http://localhost:8080/api/exercise/goal');
                console.log(data);
                if(data){
                    setExercise(data??[])
                }
            }catch (err){
                console.log(err)
            }
        })();
    }, []);


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                maxWidth: "1000px",
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
                    fontWeight: "bold",
                    textAlign: "center"
                }}
            >
                나의 운동 목표
            </h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    marginBottom: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>운동 이름</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>무게 목표(kg)</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>개수 목표(개)</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>거리 목표</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>시간 목표</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>시작일</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>완료일</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>상태</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>관리</th>
                </tr>
                </thead>
                <tbody>
                {exercise.map((e) => (
                    <tr key={e.exerciseGoalId}>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{e.name || "-"}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                            {e.weightGoal != null ? `${e.weightGoal}kg` : "-"}
                        </td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                            {e.countGoal != null ? `${e.countGoal}개` : "-"}
                        </td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                            {e.distanceGoal != null && e.distanceGoal !== "" ? `${e.distanceGoal}` : "-"}
                        </td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                            {e.timeGoal != null ? `${e.timeGoal}` : "-"}
                        </td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{e.startingDate || "-"}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{e.completeDate || "-"}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{e.status || "-"}</td>
                        <td
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px"
                            }}
                        >
                            <button
                                onClick={() => navigate(`/workout/exercise/updateGoal/${e.exerciseGoalId}`)}
                                style={{
                                    padding: "6px 12px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                수정
                            </button>
                            <button
                                onClick={async () => {
                                    if (window.confirm("정말 삭제할까요?")) {
                                        try {
                                            await fetcher(
                                                `http://localhost:8080/api/exercise/deleteGoal/${e.exerciseGoalId}`,
                                                { method: "DELETE" }
                                            );
                                            await load();
                                        } catch (err) {
                                            alert("삭제 실패: " + err.message);
                                        }
                                    }
                                }}
                                style={{
                                    padding: "6px 12px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
                    onClick={() => navigate("/workout/exercise/createGoal")}
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
                    운동목표 추가하기
                </button>
                <button
                    onClick={() => navigate("/workout/goal")}
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
                    돌아가기
                </button>
            </div>
        </div>
    );

}