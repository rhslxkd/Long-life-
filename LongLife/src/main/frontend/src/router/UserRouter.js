import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../longlife/home/Home";
import MyInfo from "../longlife/users/MyInfo";
import UserEdit from "../longlife/users/UserEdit";

export default function UserRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route element={<UserLayout />}>
                {/*홈*/}
                <Route path="/" element={<Home />} />
                {/* 회원 상세 */}
                <Route path="/myInfo" element={<MyInfo />} />
                {/* 회원 수정 */}
                <Route path="/userEdit" element={<UserEdit />} />
            </Route>
        </Route>
    );
}