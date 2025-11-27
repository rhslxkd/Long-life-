import React, { useState, useEffect } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { fetcher } from "../../fetcher";

function Session() {
    const { formDate: date } = useParams();
    const [session, setSession] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        const data = await fetcher(`http://localhost:8080/api/workout/session/${date}`);
        setSession(data ?? []);
    };

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                await load();
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    if (loading) return <div className="content">불러오는 중...</div>;
    if (err) return <div className="content">{err}</div>;
    if (!session.length) {
        return (
            <div className="content">
                운동일지가 없습니다.
                <div style={{ marginTop: "15px" }}>
                    <Link
                        to="/workout/addSession"
                        style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        운동일지 추가하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="content">
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
                        <td>{s.name}</td>
                        <td>{s.note}</td>
                        <td>{s.startedAt}</td>
                        <td>{s.endedAt}</td>
                        <td>{s.location}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Session;
