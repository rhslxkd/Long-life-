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
        <div className="container my-4" style={{ maxWidth: 480 }}>
            <h2 className="text-center">회원정보 상세보기</h2>
            <table className="table table-bordered table-hover mt-4">
                <tbody>
                <tr>
                    <th scope="col" className="w-25 py-3">아이디</th>
                    <td className="form-group w-75 py-3">{user.userId}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25 py-3">이름</th>
                    <td className="form-group w-75 py-3">{user.name}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25 py-3">이메일</th>
                    <td className="form-group w-75 py-3">{user.email}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25 py-3">주소</th>
                    <td className="form-group w-75 py-3">{user.address}</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25 py-3">키</th>
                    <td className="form-group w-75 py-3">{user.height} cm</td>
                </tr>
                <tr>
                    <th scope="col" className="w-25 py-3">몸무게</th>
                    <td className="form-group w-75 py-3">{user.weight} kg</td>
                </tr>
                </tbody>
            </table>
            <div className="text-center">
                <button className="btn btn-primary" type="button" onClick={() => {
                    navigate(`/userEdit`);
                }}>수정
                </button>
                &nbsp;
                <button className="btn btn-danger" type="button" onClick={() => {
                    if (window.confirm('정말 탈퇴할까요?')) {
                        (async () => {
                            await fetcher(`http://localhost:8080/api/users/${uuser.userId}`, {
                                method: 'DELETE'
                            });
                            navigate('/login');
                        })();
                    }
                }}>탈퇴
                </button>
            </div>
        </div>
    );
}

export default MyInfo;