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
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");

    const [err, setErr] = useState(null);

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
            setSession(data)
        })();
    }, []);

    useEffect(() => {
        if (session && exercises.length > 0) {
            // exerciseName으로 해당 운동 찾기
            const matched = exercises.find(e => e.name === session.exerciseName);

            if (matched) {
                setType1(matched.type1);
                setType2(matched.type2);
            }

            // 기존 값 세팅
            setValue("exerciseName", session.exerciseName);
            setValue("startedAt", session.startedAt?.slice(0, 16));
            setValue("endedAt", session.endedAt?.slice(0, 16));
            setValue("location", session.location);
            setValue("note", session.note);
        }
    }, [session, exercises, setValue]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher('http://localhost:8080/api/exercise');
                setExercises(data);
                // 카테고리1 고정을 위해 처음에 랜더링 시 한번만
                setCat1([...new Set(data.map((e) => e.type1))]);
            } catch (e) {
                setErr(e.message);
            }
        })();
    }, [session]);

    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
            // 세션에서 이미 type2를 세팅한 경우에는 초기화하지 않음
            if (!session) {
                setType2("");
                setExerciseList([]);
            }
        } else {
            setCat2([]);
            setType2("");
            setExerciseList([]);
        }
    }, [type1, exercises, session]);


    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);


    const updateSession = async (data) => {
        try {
            await fetcher(`http://localhost:8080/api/workout/updateSession/${sessionId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
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
                    <label>운동 유형</label>
                    <select value={type1} onChange={(e) => setType1(e.target.value)}>
                        <option value="">운동 유형 선택</option>
                        {cat1.map((c, index) => (
                            <option key={index} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>운동 분류</label>
                    <select value={type2} onChange={(e) => setType2(e.target.value)}>
                        <option value="">운동 분류 선택</option>
                        {cat2.map((c, index) => (
                            <option key={index} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>운동</label>
                    <select {...register("exerciseName", {required: true})}
                            value={session?.exerciseName || ""}
                            onChange={(e) => setValue("exerciseName", e.target.value)}>
                        <option value="">운동 선택</option>
                        {exerciseList.map((exercise, index) => (
                            <option key={index} value={exercise.name}>
                                {exercise.name}
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
