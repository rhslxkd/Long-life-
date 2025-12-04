import { useForm } from "react-hook-form";
import { fetcher } from "../../lib/fetcher";
import useMe from "../../hooks/useMe";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CreateSession() {
    const { formDate: date } = useParams();
    const users = useMe();
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

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
    }, []);


    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
        } else {
            setCat2([]);
        }
        setType2(""); // 초기화
        setExerciseList([]); // 초기화
    }, [type1, exercises]);

    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);


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
                    <select {...register("exerciseName", { required: true })}>
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
