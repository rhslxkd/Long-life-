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
import PhysicalGoal from "../longlife/goal/PhysicalGoal";
import UpdatePhysicalGoal from "../longlife/goal/UpdatePhysicalGoal";
import CreatePhysicalGoal from "../longlife/goal/CreatePhysicalGoal";
import Exercise from "../longlife/admin/Exercise";
import ExerciseGoal from "../longlife/goal/ExerciseGoal";
import CreateExerciseGoal from "../longlife/goal/CreateExerciseGoal";
import UpdateExerciseGoal from "../longlife/goal/UpdateExerciseGoal";

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

                {/* 운동 일지 */}
                <Route path="/workout/calendar" element={<Calendar />} />
                <Route path="/workout/session/:formDate" element={<Session />} />
                <Route path="/workout/createSession/:formDate" element={<CreateSession />} />
                <Route path="/workout/updateSession/:formDate/:sessionId" element={<UpdateSession />} />

                {/* 체중 목표 */}
                <Route path="/physical/goal" element={<PhysicalGoal />} />
                <Route path="/physical/createGoal" element={<CreatePhysicalGoal />} />
                <Route path="/physical/updateGoal/:id" element={<UpdatePhysicalGoal />} />

                {/* 운동 목표 */}
                <Route path="/exercise/goal" element={<ExerciseGoal />} />
                <Route path="/exercise/createGoal" element={<CreateExerciseGoal />} />
                <Route path="/exercise/updateGoal/:id" element={<UpdateExerciseGoal />} />



            </Route>
        </Route>
    );
}