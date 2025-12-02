import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../longlife/home/Home";
import Calendar from "../longlife/session/Calendar";
import Session from "../longlife/session/Session";
import CreateSession from "../longlife/session/CreateSession";
import UpdateSession from "../longlife/session/UpdateSession";

export default function UserRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route element={<UserLayout />}>
                {/*홈*/}
                <Route path="/" element={<Home />} />
                <Route path="/workout/calendar" element={<Calendar />} />
                <Route path="/workout/session/:formDate" element={<Session />} />
                <Route path="/workout/createSession/:formDate" element={<CreateSession />} />
                <Route path="/workout/updateSession/:formDate/:sessionId" element={<UpdateSession />} />
            </Route>
        </Route>
    );
}