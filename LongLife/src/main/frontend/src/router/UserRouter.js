import RequiredAuth from "../components/RequiredAuth";
import {Route, Routes} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import Home from "../longlife/home/Home";
import ExerciseStoryList from "../longlife/story/ExerciseStoryList";
import PostStory from "../longlife/story/PostStory";
import StoryList from "../longlife/story/StoryList";

export default function UserRouter() {
    return (
        <Route element={<RequiredAuth />}>
            <Route element={<UserLayout />}>
                {/*홈*/}
                <Route path="/" element={<Home />} />
                {/*  운동스토리 리스트  */}
                <Route path="/exerciseStoryList" element={<ExerciseStoryList />} />
                <Route path="/postStory" element={<PostStory />} />
                <Route path="/storyList" element={<StoryList />} />
            </Route>
        </Route>
    );
}