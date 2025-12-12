import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashBoard from "../longlife/admin/DashBoard";
import ExerciseList from "../longlife/admin/ExerciseList";
import UserList from "../longlife/admin/UserList";
import PostList from "../longlife/admin/PostList";


export default function AdminRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route path="/admin" element={<AdminLayout />}>

                <Route index element={<DashBoard />} />

                {/* 유저 관리 */}
                <Route path="userList" element={<UserList />} />
                {/* 운동 종목 관리 */}
                <Route path="exerciseList" element={<ExerciseList />} />
                {/* 스토리 관리 */}
                <Route path="postList" element={<PostList />} />
            </Route>
        </Route>
    );
}