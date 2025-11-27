import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashBoard from "../longlife/admin/DashBoard";


export default function AdminRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route path="/admin" element={<AdminLayout />}>

                <Route index element={<DashBoard />} />

            </Route>
        </Route>
    );
}