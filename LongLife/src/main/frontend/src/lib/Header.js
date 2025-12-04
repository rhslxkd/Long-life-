import useMe from "../hooks/useMe";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "./fetcher";

export default function Header() {
    const user = useMe();

    const [ loading, setLoading] = useState(!user);
    const navigate = useNavigate();

    const onLogout = async () => {
        await fetcher('http://localhost:8080/api/users/logout', {
            method: 'POST'
        });
        sessionStorage.removeItem("user");
        navigate("/login", {replace: true});
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Long life;
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/workout/calendar">운동일지</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/physical/goal">목표</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">스토리</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/friends" id="navbarDropdown" role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    친구
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/friends">친구목록</a></li>
                                    <li><a className="dropdown-item" href="/friendSearch">친구찾기</a></li>
                                    <li><a className="dropdown-item" href="/requests">받은요청</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/chat">chatbot</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#" tabIndex="-1"
                                   aria-disabled="true">Disabled</a>
                            </li>
                            {user?.role === "ROLE_ADMIN" && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/admin">관리자페이지</a>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            {user && <span style={{marginLeft: 12}}>안녕하세요, {user.name}({user.userId})님</span>}
                        </div>
                        <div className="text-end">
                            {user && <button type="button" className="btn btn-outline-light me-2"
                                             onClick={() => navigate('/myInfo')}>내정보</button>}
                            <button type="button" className="btn btn-outline-light me-2" onClick={onLogout}>로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}