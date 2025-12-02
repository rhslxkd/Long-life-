import { useForm } from "react-hook-form";
import { fetcher } from "../../lib/fetcher";
import useMe from "../../hooks/useMe";
import {useNavigate, useParams} from "react-router-dom";

export default function CreateSession() {
    const { formDate: date } = useParams();
    const exerciseList = [
        "풀업",
        "랫풀다운",
        "스쿼트",
        "런지",
        "싯업",
        "플랭크",
        "밀리터리프레스",
        "사이드레터럴레이즈",
        "푸쉬업",
        "딥스",
        "마라톤",
        "조깅"
    ];

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const users = useMe();
    const navigate = useNavigate();

    const createSession = async (data) => {
        const { exerciseName, note, location, startedAt, endedAt } = data;
        const id = users?.id;

        // 전달받은 날짜 (예: "2025-11-29")
        const baseDate = date;

        // 날짜와 시간 합치기
        const startedDateTime = `${baseDate}T${startedAt}`;
        const endedDateTime = `${baseDate}T${endedAt}`;

        const sessionData = {
            exerciseName,
            note,
            location,
            startedAt: startedDateTime,
            endedAt: endedDateTime,
            id
        };

        try {
            await fetcher("http://localhost:8080/api/workout/createSession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            });
            navigate(`/workout/session/${date}`);
        } catch (err) {
            console.error(err);
            alert("세션 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h1>운동일지 추가하기</h1>
            <form onSubmit={handleSubmit(createSession)}>
                <div>
                    <label>운동</label>
                    <select {...register("exerciseName", { required: true })}>
                        <option value="">운동 선택</option>
                        {exerciseList.map((exercise, index) => (
                            <option key={index} value={exercise}>
                                {exercise}
                            </option>
                        ))}
                    </select>
                    {errors.exerciseName && <p>운동을 선택해주세요.</p>}
                </div>

                <div>
                    <label>메모</label>
                    <input {...register("note")} placeholder="운동 메모" />
                </div>

                <div>
                    <label>장소</label>
                    <input {...register("location")} placeholder="운동 장소" />
                </div>

                <div>
                    <label>시작 시간</label>
                    <input type="time" {...register("startedAt", { required: true })} />
                </div>

                <div>
                    <label>종료 시간</label>
                    <input type="time" {...register("endedAt", { required: true })} />
                </div>

                <button type="submit">추가하기</button>
                <button type="button"
                onClick={()=>navigate(`/workout/session/${date}`)}>뒤로가기</button>
            </form>
        </div>
    );
}
