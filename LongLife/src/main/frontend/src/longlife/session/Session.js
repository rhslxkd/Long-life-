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
            navigate(`/workout/session/${todayStr}`, { replace: true });
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
        <div className="content">
            <h2>
                <button
                    onClick={() => changeDate(-1)}
                    style={{marginRight: "10px"}}
                >
                    ◀
                </button>

                {date}

                <button
                    onClick={() => changeDate(1)}
                    disabled={currentStr >= todayStr}
                    style={{
                        marginLeft: "10px",
                        opacity: currentStr >= todayStr ? 0.5 : 1,
                        cursor: currentStr >= todayStr ? "not-allowed" : "pointer"
                    }}
                >
                    ▶
                </button>
                <br/>
                운동일지
            </h2>

            {!session.length ? (
                <div>
                    운동일지가 없습니다.
                </div>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <td>운동</td>
                        <td>내용</td>
                        <td>시작 일시</td>
                        <td>종료 일시</td>
                        <td>위치</td>
                    </tr>
                    </thead>
                    <tbody>
                    {session.map((s) => (
                        <tr key={s.sessionId}>
                            <td>{s.exerciseName}</td>
                            <td>{s.note}</td>
                            <td>{formatKST(s.startedAt)}</td>
                            <td>{formatKST(s.endedAt)}</td>
                            <td>{s.location}</td>
                            <td>
                                <button
                                    onClick={() => navigate(`/workout/updateSession/${date}/${s.sessionId}`)}>
                                    수정
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('정말 삭제할까요?')) {
                                            try {
                                                await fetcher(`http://localhost:8080/api/workout/${s.sessionId}`, {
                                                    method: "DELETE"
                                                });
                                                await load(date); // 삭제 후 최신 데이터 다시 불러오기
                                            } catch (e) {
                                                alert("삭제 실패: " + e.message);
                                            }
                                        }
                                    }}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <button onClick={() => navigate(`/workout/createSession/${date}`)}>
                운동일지 추가하기
            </button>
            <button onClick={() => navigate(`/workout/calendar`)}>
                캘린더로 돌아가기
            </button>
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
