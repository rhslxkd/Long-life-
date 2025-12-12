import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useMe from "../../hooks/useMe";

export default function NavBar() {
    const user = useMe();

    const [loading, setLoading] = useState(!user);
    const navigate = useNavigate();

    const onLogout = async () => {
        await fetch('http://localhost:8080/api/users/logout', {
            method: 'POST',
            credentials: "include" // 쿠키나 인증 정보를 함께 보내도록 설정하는 옵션
        });
        sessionStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login", { replace: true });
    }

    const onToggleSidebar = (e) => {
        e.preventDefault();
        document.body.classList.toggle("sidebar-collapse");
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-whtie navbar-light">
            {/* 왼쪽 메뉴 */}
            <ul className="navbar-nav">
                {/* 사이드바 토글 버튼 */}
                <li className="nav-item">
                    <a href="#" className="nav-link" data-widget="pushmenu" role="button" onClick={onToggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </a>
                </li>

                {/* 홈 링크 */}
                <li className="nav-item d-none d-sm-inline-block">
                    <a href="/" className="nav-link">페이지</a>
                </li>
            </ul>

            {/* 오른쪽 메뉴 */}
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown d-flex">
                    <span className="dropdown-item dropdown-header me-4">
                        {user && <span style={{ marginLeft: 12 }}>안녕하세요, {user.name}({user.userId})님</span>}
                    </span>

                    <button className="text-danger dropdown-item me-4" onClick={onLogout}>
                        <i className="fas fa-sign-out-alt mr-5">로그아웃</i>
                    </button>
                </li>
            </ul>
        </nav>
    );
}