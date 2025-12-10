import Calendar from "../session/Calendar";
import {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

export default function Home() {

    const [homeSession, setHomeSession] = useState([]);
    const [physical, setPhysical] = useState("");
    const [exerciseGoal, setExerciseGoal] = useState([]);
    const navigate = useNavigate();
    const today = new Date();

    // 체중 목표
    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/physical/goal");
                console.log(data);
                if (data) {
                    setPhysical(data ?? []);
                }
            } catch (e) {
                console.error("데이터 불러오기 실패:", e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/exercise/goal");
                console.log(data)
                if (data) {
                    setExerciseGoal(data ?? []);
                }
            } catch (e) {
                console.error("데이터 불러오기 실패:", e);
            }
        })();
    }, []);

    // 운동일지
    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher('http://localhost:8080/api/workout/homeSession');
                if (data) {
                    setHomeSession(data)
                }
            } catch (e) {
                console.error("데이터 불러오기 실패:", e)
            }

        })();
    }, []);
    const ongoingGoals = exerciseGoal.filter(e => e.status === "ONGOING");

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            width: "100%",
            height: "100vh"
        }}>
            <div style={{
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                gap: "30px",
                height: "100%"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "50px"
                }}>
                    {/* 체중 목표 */}
                    <div
                        onClick={() => navigate("/workout/physical/goal")}
                        style={{
                            padding: "20px",
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            maxWidth: "325px",
                            marginLeft: "30px",
                            marginTop: "30px",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            textAlign: "center"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.03)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                    >
                        <h2
                            style={{
                                marginBottom: "20px",
                                fontSize: "1.8rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#333"
                            }}
                        >
                            나의 체중 목표
                        </h2>

                        {physical ? (
                                <div>
                                    <h3 style={{
                                        padding: "10px",
                                        borderBottom: "1px solid #eee",
                                        color: "#e74c3c",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>
                                        {Math.abs(physical.kgGoal - physical.weight)}kg {physical.kgGoal > physical.weight ? "증량" : "감량"}까지{" "}
                                        {Math.ceil((new Date(physical.completeDate) - new Date()) / (1000 * 60 * 60 * 24))}일
                                    </h3>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            textAlign: "center",
                                            fontSize: "15px"
                                        }}
                                    >
                                        <thead style={{backgroundColor: "#f8f9fa"}}>
                                        <tr>
                                            <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>
                                                목표 체중
                                            </th>
                                            <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>
                                                현재 체중
                                            </th>
                                        </tr>

                                        </thead>
                                        <tbody>
                                        <tr
                                            style={{
                                                backgroundColor: "#fafafa",
                                                transition: "background-color 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9f5ff")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                                        >
                                            <td style={{
                                                padding: "10px",
                                                borderBottom: "1px solid #eee"
                                            }}>{physical.kgGoal}kg
                                            </td>
                                            <td style={{
                                                padding: "10px",
                                                borderBottom: "1px solid #eee"
                                            }}>{physical.weight}kg
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>) :
                            <h4
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/workout/physical/createGoal")
                                }}
                                style={{
                                    marginTop: "10px",
                                    padding: "14px 20px",
                                    backgroundColor: "#f0f8ff",
                                    color: "#007bff",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    border: "1px solid #d0e7ff",
                                    display: "inline-block",
                                    transition: "all 0.25s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e6f2ff";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                ➕ 목표 설정하러 가기
                            </h4>

                        }
                    </div>

                    {/* 운동 목표 */}

                    <div
                        onClick={() => navigate("/workout/exercise/goal")}
                        style={{
                            padding: "20px",
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            maxWidth: "325px",
                            marginTop: "30px",
                            marginRight: "30px",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            textAlign: "center"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.03)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                    >
                        <h2
                            style={{
                                marginBottom: "20px",
                                fontSize: "1.8rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#333"
                            }}
                        >
                            나의 운동 목표
                        </h2>

                        {ongoingGoals.length ? (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        textAlign: "center",
                                        fontSize: "15px"
                                    }}
                                >
                                    <thead style={{backgroundColor: "#f8f9fa"}}>
                                    <tr>
                                        <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>운동 이름
                                        </th>
                                        <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>목표</th>
                                        <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>기한</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {exerciseGoal.map(e => (
                                        <tr
                                            key={e.exerciseGoalId}
                                            style={{
                                                backgroundColor: "#fafafa",
                                                transition: "background-color 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9f5ff")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                                        >
                                            <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{e.name}</td>
                                            <td style={{
                                                padding: "10px",
                                                borderBottom: "1px solid #eee"
                                            }}>{e.distanceGoal || ""} {e.timeGoal || ""} {e.weightGoal == null ? " " : e.weightGoal + "kg"} {e.countGoal == null ? " " : e.countGoal + "개"}</td>
                                            <td style={{
                                                padding: "10px",
                                                borderBottom: "1px solid #eee",
                                                color: "#e74c3c",
                                                fontWeight: "bold"
                                            }}>
                                                {Math.ceil((new Date(e.completeDate) - new Date()) / (1000 * 60 * 60 * 24))}일
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>) :
                            <h4
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/workout/exercise/createGoal")
                                }}
                                style={{
                                    marginTop: "10px",
                                    padding: "14px 20px",
                                    backgroundColor: "#f0f8ff",
                                    color: "#007bff",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    border: "1px solid #d0e7ff",
                                    display: "inline-block",
                                    transition: "all 0.25s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e6f2ff";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                ➕ 목표 설정하러 가기
                            </h4>
                        }
                    </div>
                </div>

                {/* 운동 일지 */}

                <div
                    onClick={() => navigate("/workout/calendar")}
                    style={{
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        maxWidth: "700px",
                        marginLeft: "30px",
                        marginRight: "30px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        textAlign: "center"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.03)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                >
                    <h2
                        style={{
                            marginBottom: "20px",
                            fontSize: "1.8rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#333"
                        }}
                    >
                        나의 운동일지
                    </h2>

                    {homeSession.length > 0 ? (
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    textAlign: "center",
                                    fontSize: "15px"
                                }}
                            >
                                <thead style={{backgroundColor: "#f8f9fa"}}>
                                <tr>
                                    <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>날짜</th>
                                    <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>위치</th>
                                    <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>운동</th>
                                    <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>내용</th>
                                </tr>
                                </thead>
                                <tbody>
                                {homeSession.map((h) => (
                                    <tr
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/workout/session/${h.startedAt.slice(0, 10)}`)
                                        }}
                                        key={h.sessionId}
                                        style={{
                                            backgroundColor: h.sessionId % 2 === 0 ? "#fafafa" : "white",
                                            transition: "background-color 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9f5ff")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = h.sessionId % 2 === 0 ? "#fafafa" : "white")}
                                    >
                                        <td style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee"
                                        }}>{h.startedAt.slice(0, 10)}</td>
                                        <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{h.location}</td>
                                        <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{h.exercise.name}</td>
                                        <td style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #eee",
                                            textAlign: "left"
                                        }}>{h.note.length > 20 ? h.note.slice(0, 20) + "..." : h.note}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )
                        :
                        <h4
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate("/workout/calendar")
                            }}
                            style={{
                                marginTop: "10px",
                                padding: "14px 20px",
                                backgroundColor: "#f0f8ff",
                                color: "#007bff",
                                borderRadius: "8px",
                                textAlign: "center",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                border: "1px solid #d0e7ff",
                                display: "inline-block",
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#e6f2ff";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#f0f8ff";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            ➕ 일지 작성하러 가기
                        </h4>
                    }
                </div>
            </div>
            <div style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                maxWidth: "700px",
                marginLeft: "30px",
                marginRight: "30px",
                marginTop: "30px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                textAlign: "center"
            }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "scale(1.03)";
                     e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "scale(1)";
                     e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                 }}>
                스토리
            </div>

        </div>
    );


}
