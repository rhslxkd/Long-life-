import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "../../lib/fetcher";
import Session from "./Session";

export default function UpdateSession() {

    const {formDate: date} = useParams();
    const params = useParams();
    const navigate = useNavigate();
    const sessionId = params?.sessionId;
    const [session, setSession] = useState(null);

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
        setValue,
        formState: {errors}
    } = useForm();

    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/workout/updateSession/${sessionId}`)
            console.log(data)
            console.log(date)
            setSession(data)
        })();
    }, []);

    useEffect(() => {
        if (session != null) {
            setValue("startedAt", session.startedAt?.slice(0, 16));
            setValue("endedAt", session.endedAt?.slice(0, 16));
            setValue("location", session.location);
            setValue("note", session.note);
            setValue("exerciseName", session.exerciseName);
        }
    }, [session])

    const updateSession = async (data) => {
        try {
            await fetcher(`http://localhost:8080/api/workout/updateSession/${sessionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            alert("운동일지가 수정되었습니다.");
            navigate(`/workout/session/${date}`);
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit(updateSession)}>
                <h1>{date} 운동일지 수정하기</h1>
                <div>
                    <label>운동: </label>
                    <select {...register("exerciseName", {required: true})}>
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
                    <input {...register("note")} placeholder="운동 메모"/>
                </div>

                <div>
                    <label>장소</label>
                    <input {...register("location", {
                        required: "장소 입력은 필수입니다.",
                        maxLength: {value: 255, message: "장소는 255자 이내로 입력바랍니다."}
                    })} placeholder="운동 장소"/>
                    {errors.location && <small role="alert">{errors.location.message}</small>}
                </div>

                <div>
                    <label>시작 시간</label>
                    <input type="datetime-local" {...register("startedAt", {required: "시작시간 선택은 필수입니다."})} />
                    {errors.startedAt && <small role="alert">{errors.startedAt.message}</small>}
                </div>

                <div>
                    <label>종료 시간</label>
                    <input type="datetime-local" {...register("endedAt", {required: "시작시간 선택은 필수입니다."})} />
                    {errors.endedAt && <small role="alert">{errors.endedAt.message}</small>}
                </div>

                <div>
                    <input type="submit" value="일지 수정"/>
                    <input type="button" value="목록"
                    onClick={() => navigate(`/workout/session/${date}`)}/>
                </div>
            </form>
        </div>
    );
}
