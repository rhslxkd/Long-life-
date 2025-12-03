import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashBoard from "../longlife/admin/DashBoard";
import Exercise from "../longlife/admin/Exercise";


export default function AdminRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route path="/admin" element={<AdminLayout />}>

                <Route index element={<DashBoard />} />

                {/* 운동 종목 관리 */}
                <Route path="exercise" element={<Exercise />} />
            </Route>
        </Route>
    );
}