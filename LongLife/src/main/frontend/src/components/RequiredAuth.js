import {Outlet, Navigate, useLocation} from "react-router-dom";
import useMe from "../hooks/useMe";

function RequiredAuth() {
    const user = useMe();
    const location = useLocation();

    if (!user) {
        // 사용자가 인증되지 않은 경우 로그인 페이지로 리디렉션
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />;
}

export default RequiredAuth;