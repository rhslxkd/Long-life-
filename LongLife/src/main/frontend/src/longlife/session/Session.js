import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetcher} from "../../fetcher";

function Session() {
    const params = useParams();
    const date = params?.formDate;
    const [session, setSession] = useState([]);   // 리스트로 관리
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const load = async () => {
        // const data = await fetcher(`http://localhost:8080/api/workout/session/${date}`);
        const data = await fetcher(`http://localhost:8080/api/workout/session`);
        setSession(data ?? []); // 데이터 없으면 빈 배열
    }

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                // console.log(`Loading session for date: ${date}`);
                // const data = await fetcher(`http://localhost:8080/workout/api/session/${date}`);
                const data = await fetcher(`http://localhost:8080/workout/api/session`);
                setSession(data ?? []); // 리스트로 세팅
                await load();
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    if (loading) return <div className="content">불러오는 중...</div>
    if (err) return <div className="content">{err}</div>
    if (!session.length) return <div className="content">현재 예약 정보가 없습니다.</div>

    return (
        <div className="content">

            <h2>{date} 운동일지</h2>

        </div>
    );
}

export default Session;
