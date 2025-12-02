import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../longlife/home/Home";
import MyInfo from "../longlife/users/MyInfo";
import UserEdit from "../longlife/users/UserEdit";
import UpdateSession from "../longlife/session/UpdateSession";
import Calendar from "../longlife/session/Calendar";
import Session from "../longlife/session/Session";
import CreateSession from "../longlife/session/CreateSession";

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

                <Route path="/workout/calendar" element={<Calendar />} />
                <Route path="/workout/session/:formDate" element={<Session />} />
                <Route path="/workout/createSession/:formDate" element={<CreateSession />} />
                <Route path="/workout/updateSession/:formDate/:sessionId" element={<UpdateSession />} />
            </Route>
        </Route>
    );
}