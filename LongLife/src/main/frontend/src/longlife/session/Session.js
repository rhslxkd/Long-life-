import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function Session() {
    const {formDate} = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState(formDate); // 현재 날짜 상태
    const [session, setSession] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const load = async (targetDate) => {
        const data = await fetcher(`http://localhost:8080/api/workout/session/${targetDate}`);
        setSession(data ?? []);
    };

    useEffect(() => {
        const todayStr = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD (로컬 기준)

        if (formDate > todayStr) {
            // 미래 날짜 접근 시 오늘로 리다이렉트
            alert("잘못된 날짜 접근입니다. 오늘로 이동합니다.");
            setDate(todayStr);
            navigate(`/workout/session/${todayStr}`, {replace: true});
            window.location.reload();
        } else {
            setDate(formDate);
        }
    }, [formDate, navigate]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                await load(date);
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    // 날짜 이동 함수
    const changeDate = (days) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);

        const todayStr = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
        const formatted = newDate.toLocaleDateString("sv-SE");   // YYYY-MM-DD

        if (formatted > todayStr) return; // 오늘 이후는 이동 불가

        setDate(formatted);
        navigate(`/workout/session/${formatted}`);
    };

// 오늘 날짜 계산
    const todayStr = new Date().toLocaleDateString("sv-SE");
    const currentStr = new Date(date).toLocaleDateString("sv-SE");

    if (loading) return <div className="content">불러오는 중...</div>;
    if (err) return <div className="content">{err}</div>;

    return (
        <div className="content"
             style={{
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "center",
                 textAlign: "center"
             }}>
            <h2
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "30px",
                    marginBottom: "10px",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    gap: "15px"   // 버튼과 날짜 사이 간격을 동일하게
                }}
            >
                <button
                    onClick={() => changeDate(-1)}
                    style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        fontSize: "25px"
                    }}
                >
                    ◀
                </button>

                <span>{date}</span>

                <button
                    onClick={() => changeDate(1)}
                    disabled={currentStr >= todayStr}
                    style={{
                        cursor: currentStr >= todayStr ? "not-allowed" : "pointer",
                        background: "none",
                        border: "none",
                        fontSize: "25px",
                        opacity: currentStr >= todayStr ? 0.5 : 1
                    }}
                >
                    ▶
                </button>
            </h2>


            {!session.length ? (
                <div>
                    운동일지가 없습니다.
                </div>
            ) : (
                <table
                    className="table table-bordered table-hover"
                    style={{
                        width: "90%",
                        margin: "20px auto",
                        textAlign: "center",
                        verticalAlign: "middle",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <thead style={{backgroundColor: "#f8f9fa"}}>
                    <tr>
                        <th>운동</th>
                        <th>내용</th>
                        <th>시작 일시</th>
                        <th>종료 일시</th>
                        <th>위치</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {session.map((s) => (
                        <tr key={s.sessionId}>
                            <td style={{ verticalAlign: "middle" }}>{s.exerciseName}</td>
                            <td style={{ verticalAlign: "middle" }}>{s.note}</td>
                            <td style={{ verticalAlign: "middle" }}>{formatKST(s.startedAt)}</td>
                            <td style={{ verticalAlign: "middle" }}>{formatKST(s.endedAt)}</td>
                            <td style={{ verticalAlign: "middle" }}>{s.location}</td>
                            <td style={{display: "flex", justifyContent: "center", gap: "8px"}}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/workout/updateSession/${date}/${s.sessionId}`)
                                    }
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
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm("정말 삭제할까요?")) {
                                            try {
                                                await fetcher(
                                                    `http://localhost:8080/api/workout/${s.sessionId}`,
                                                    {method: "DELETE"}
                                                );
                                                await load(date);
                                            } catch (e) {
                                                alert("삭제 실패: " + e.message);
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

            )}
            <div style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "10px"
            }}>
                <button
                    onClick={() => navigate(`/workout/createSession/${date}`)}
                    style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: loading ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        marginRight: "10px"
                    }}
                >
                    운동일지 추가하기
                </button>

                <button
                    onClick={() => navigate(`/workout/calendar?date=${date}`)}
                    style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: loading ? "#ccc" : "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    캘린더로 돌아가기
                </button>
            </div>
        </div>
    );

}

function formatKST(iso) {
    try {
        return new Date(iso).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
    } catch {
        return iso;
    }
}
