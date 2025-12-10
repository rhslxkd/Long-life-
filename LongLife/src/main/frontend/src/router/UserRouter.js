import RequiredAuth from "../components/RequiredAuth";
import {Route} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../longlife/home/Home";
import PostStory from "../longlife/story/PostStory";
import StoryList from "../longlife/story/StoryList";
import MyInfo from "../longlife/users/MyInfo";
import UserEdit from "../longlife/users/UserEdit";
import UpdateSession from "../longlife/session/UpdateSession";
import Calendar from "../longlife/session/Calendar";
import Session from "../longlife/session/Session";
import CreateSession from "../longlife/session/CreateSession";
import PhysicalGoal from "../longlife/goal/PhysicalGoal";
import CreatePhysicalGoal from "../longlife/goal/CreatePhysicalGoal";
import Friends from "../longlife/friends/Friends";
import FriendSearch from "../longlife/friends/FriendSearch";
import Requests from "../longlife/friends/Requests";
import UpdatePhysicalGoal from "../longlife/goal/UpdatePhysicalGoal";
import ExerciseGoal from "../longlife/goal/ExerciseGoal";
import CreateExerciseGoal from "../longlife/goal/CreateExerciseGoal";
import UpdateExerciseGoal from "../longlife/goal/UpdateExerciseGoal";
import Goal from "../longlife/goal/Goal";

export default function UserRouter() {
    return (
        <Route element={<RequiredAuth/>}>
            <Route element={<UserLayout/>}>
                {/*홈*/}
                <Route path="/" element={<Home/>}/>
                {/*  운동스토리 리스트  */}
                <Route path="/postStory" element={<PostStory/>}/>
                <Route path="/storyList" element={<StoryList/>}/>
                {/* 회원 상세 */}
                <Route path="/myInfo" element={<MyInfo/>}/>
                {/* 회원 수정 */}
                <Route path="/userEdit" element={<UserEdit/>}/>
                {/* 친구 목록 */}
                <Route path="/friends" element={<Friends/>}/>
                {/* 친구 찾기 및 요청*/}
                <Route path="/friendSearch" element={<FriendSearch/>}/>
                {/* 친구 요청 받은 목록 */}
                <Route path="/requests" element={<Requests/>}/>


                <Route path="/workout/calendar" element={<Calendar/>}/>

                <Route path="/workout/session/:formDate" element={<Session/>}/>
                <Route path="/workout/createSession/:formDate" element={<CreateSession/>}/>
                <Route path="/workout/updateSession/:formDate/:sessionId" element={<UpdateSession/>}/>

                <Route path="/workout/goal" element={<Goal/>}/>


                <Route path="/workout/physical/goal" element={<PhysicalGoal/>}/>
                <Route path="/workout/physical/createGoal" element={<CreatePhysicalGoal/>}/>
                <Route path="/workout/physical/updateGoal/:id" element={<UpdatePhysicalGoal/>}/>

                <Route path="/workout/exercise/goal" element={<ExerciseGoal/>}/>
                <Route path="/workout/exercise/createGoal" element={<CreateExerciseGoal/>}/>
                <Route path="/workout/exercise/updateGoal/:id" element={<UpdateExerciseGoal/>}/>
            </Route>
        </Route>
    );
}