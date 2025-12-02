import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { fetcher } from "../../lib/fetcher";
import useMe from "../../hooks/useMe";

function MyInfo() {
    const { userId } = useParams(); // URL 파라미터에서 userId 가져오기
    const uuser = useMe();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async ()=> {
            try {
                const data = await fetcher(`http://localhost:8080/api/users/${uuser.userId}`);
                setUser(data);
            } catch (error) {
                setErr("회원 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (loading) return <p>로딩중...</p>;

    return (
        <div className="container" style={{ maxWidth: 480 }}>
            <h2>회원정보 상세보기</h2>
            <table className="table table-bordered table-hover">
                <tbody>
                <tr>
                    <th scope="col" className="w-25">아이디</th>
                    <td className="form-group w-75">{user.userId}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25">이름</th>
                    <td className="form-group w-75">{user.name}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25">이메일</th>
                    <td className="form-group w-75">{user.email}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25">주소</th>
                    <td className="form-group w-75">{user.address}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25">키</th>
                    <td className="form-group w-75">{user.height} cm</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25">몸무게</th>
                    <td className="form-group w-75">{user.weight} kg</td>
                </tr>
                </tbody>
            </table>
            <div className="text-end">
                <button className="btn btn-primary" type="button" onClick={() => {
                    navigate(`/userEdit`);
                }}>수정
                </button>
                &nbsp;
                <button className="btn btn-danger" type="button" onClick={() => {
                    if (window.confirm('정말 삭제할까요?')) {
                        (async () => {
                            await fetcher(`http://localhost:8080/api/users/${uuser.userId}`, {
                                method: 'DELETE'
                            });
                            navigate('/login');
                        })();
                    }
                }}>삭제
                </button>
            </div>
        </div>
    );
}

export default MyInfo;