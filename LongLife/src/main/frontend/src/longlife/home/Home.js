import Calendar from "../session/Calendar";
import {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

export default function Home() {

    const [homeSession, setHomeSession] = useState([]);
    const [physical, setPhysical] = useState("");
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

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            width: "100%",
            height: "100vh",
            gap: "20px"
        }}>
            <div style={{
                display: "grid",
                gridTemplateRows: "1fr 1fr",   // 위아래 두 칸
                gap: "10px",
                height: "100%"
            }}>
                <div
                    onClick={() => navigate("/workout/physical/goal")}
                    style={{
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        maxWidth: "700px",
                        margin: "0 auto",
                        marginTop: "30px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
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
                            <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>목표 체중</th>
                            <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>현재 체중</th>
                            <th style={{padding: "12px", borderBottom: "2px solid #ddd", color: "#555"}}>체중 변화</th>
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
                            <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{physical.kgGoal}kg</td>
                            <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{physical.weight}kg</td>
                            <td style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                color: "#e74c3c",
                                fontWeight: "bold"
                            }}>
                                {Math.abs(physical.kgGoal - physical.weight)}kg {physical.kgGoal > physical.weight ? "증량" : "감량"}까지{" "}
                                {Math.ceil((new Date(physical.completeDate) - new Date()) / (1000 * 60 * 60 * 24))}일 남음
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    구역 1-2
                </div>
            </div>
            <div
                onClick={() => navigate("/workout/calendar")}
                style={{
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    maxWidth: "900px",
                    margin: "0 auto",
                    marginTop: "30px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
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
                            <td style={{padding: "10px", borderBottom: "1px solid #eee"}}>{h.exercise.type2}</td>
                            <td style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                textAlign: "left"
                            }}>{h.note}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div style={{}}>구역 3</div>
            <div style={{}}>구역 4</div>
        </div>
    );

    function calcBMI(height, weight) {
        if (!height || !weight) return "-";
        const h = height / 100; // cm → m 변환
        return (weight / (h * h)).toFixed(2); // 소수점 2자리
    }

}
