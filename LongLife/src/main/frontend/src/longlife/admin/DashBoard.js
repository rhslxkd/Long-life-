import {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";

function DashBoard() {
    const [exerciseCount, setExerciseCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data1 = await fetcher('http://localhost:8080/api/exercise/count');
                const data2 = await fetcher('http://localhost:8080/api/users/count')
                const data3 = await fetcher('http://localhost:8080/api/post/count')
                if (!data1) return
                if (!data2) return
                if (!data3) return
                setExerciseCount(data1);
                setUserCount(data2);
                setPostCount(data3);
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (err) return <div className="text-danger">{err}</div>
    if (loading) return <div>로딩중...</div>

    return(
        <div className="container" style={{maxWidth: 500}}>
            <div className="page-content-wrapper p-xxl-4">
                <div className="row">
                    <div className="col-12 mb-4 mb-sm-5">
                        <div className="d-sm-flex justify-content-between align-items-center">
                            <h1 className="h3 mb-2 mb-sm-0">대시보드</h1>
                        </div>
                    </div>
                </div>
/                <div className="row g-4 mb-5">
                        <div
                            className="card card-body bg-primary border border-primary border-opacity-25 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-1">{userCount}</h4>
                                    <span className="h5 fw-light mb-0">총 회원</span>
                                </div>
                                <div className="icon-lg rounded-circle bg-primary text-white mb-0">
                                    <i className="fa-solid fa-users fa-3x" style={{color: 'white'}}></i>
                                </div>
                            </div>
                        </div>
                        <div
                            className="card card-body bg-dark border border-dark border-opacity-25 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-1">{exerciseCount}</h4>
                                    <span className="h5 fw-light mb-0">총 운동 종목</span>
                                </div>
                                <div className="icon-lg rounded-circle bg-dark text-white mb-0"><i
                                    className="fa-solid fa-dumbbell fa-3x"></i></div>
                            </div>
                        </div>
                        <div
                            className="card card-body bg-info border border-info border-opacity-25 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-1">{postCount}</h4>
                                    <span className="h5 fw-light mb-0">총 스토리</span>
                                </div>
                                <div className="icon-lg rounded-circle bg-info text-white mb-0">
                                    <i className="fa-regular fa-clipboard fa-3x"></i>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;