import { Navigate, Route } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Register from "../longlife/users/Register";
import Login from "../longlife/users/Login";
import ForbiddenPage from "../longlife/ForbiddenPage";

export default function PublicRouter() {
    return (
        <Route element={<UserLayout />} >
            {/*없는데 *을 치거나 /을 치면 home으로 가게끔*/}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* 회원가입 */}
            <Route path={"/register"} element={<Register />} />
            {/* 로그인 */}
            <Route path={"/login"} element={<Login />} />

            {/* 403 Forbidden */}
            <Route path={"/forbidden"} element={<ForbiddenPage />} />
        </Route>
    );
}