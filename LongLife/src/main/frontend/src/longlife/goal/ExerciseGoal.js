import React, {useState, useEffect} from "react";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

export default function ExerciseGoal() {

    const [exercise, setExercise] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try{
                const data = await fetcher('http://localhost:8080/api/exercise/goal');
                console.log(data);
                if(data){
                    setExercise(data??[])
                }
            }catch (err){
                console.log(err)
            }
        })();
    }, []);


    return(
        <div>
            <h1>나의 운동 목표</h1>
            <table>
                <thead>
                <tr>
                    <td>운동 이름</td>
                    <td>무게 목표</td>
                    <td>개수 목표</td>
                    <td>거리 목표</td>
                    <td>시간 목표</td>
                    <td>시작일</td>
                    <td>완료일</td>
                    <td>상태</td>
                </tr>
                </thead>
                <tbody>
                {exercise.map((e) => (
                    <tr key={e.exerciseGoalId}>
                        <td>{e.name}</td>
                        <td>{e.weightGoal}kg</td>
                        <td>{e.countGoal}개</td>
                        <td>{e.distanceGoal}</td>
                        <td>{e.timeGoal}</td>
                        <td>{e.startingDate}</td>
                        <td>{e.completeDate}</td>
                        <td>{e.status}</td>
                        <td>
                            <button onClick={() => navigate(`/exercise/updateGoal/${e.exerciseGoalId}`)}>
                                수정
                            </button>
                        </td>
                        <td>
                            <button onClick={async () => {
                                if (window.confirm('정말 삭제할까요?')) {
                                    try {
                                        await fetcher(`http://localhost:8080/api/exercise/deleteGoal/${e.exerciseGoalId}`, {
                                            method: "DELETE"
                                        });
                                    } catch (e) {
                                        alert("삭제 실패: " + e.message);
                                    }
                                }
                            }}>
                                삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => navigate("/exercise/createGoal")}>
                운동목표 추가하기
            </button>
            <button onClick={() => navigate(`/`)}>
                돌아가기
            </button>
        </div>
    )
}