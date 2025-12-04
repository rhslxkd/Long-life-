import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function UpdateExerciseGoal() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { id: exerciseGoalId } = useParams();

    const [exerciseGoal, setExerciseGoal] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);

    // ✅ 운동목표 상세 조회
    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/exercise/goal/${exerciseGoalId}`);
            setExerciseGoal(data);
        })();
    }, []);



    // ✅ 운동목표 데이터 form에 세팅 + 운동 분류 자동 선택
    useEffect(() => {
        if (exerciseGoal && exercises.length > 0) {

            // 운동 이름으로 운동 정보 찾기
            const matched = exercises.find(e => e.name === exerciseGoal.name);

            if (matched) {
                setType1(matched.type1);
                setType2(matched.type2);
            }
            // form 값 세팅
            setValue("name", exerciseGoal.name);
            setValue("weightGoal", exerciseGoal.weightGoal);
            setValue("countGoal", exerciseGoal.countGoal);
            setValue("distanceGoal", exerciseGoal.distanceGoal);
            setValue("timeGoal", exerciseGoal.timeGoal);
            setValue("startingDate", exerciseGoal.startingDate);
            setValue("completeDate", exerciseGoal.completeDate);
        }
    }, [exerciseGoal, exercises, setValue]);

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
    }, [exerciseGoal]);

    // type1 선택 시 → cat2 세팅
    useEffect(() => {
        if (type1) {
            setCat2([...new Set(exercises.filter(e => e.type1 === type1).map(e => e.type2))]);
            // 세션에서 이미 type2를 세팅한 경우에는 초기화하지 않음
            if (!exerciseGoal) {
                setType2("");
                setExerciseList([]);
            }
        } else {
            setCat2([]);
            setType2("");
            setExerciseList([]);
        }
    }, [type1, exercises, exerciseGoal]);

    // type2 선택 시 → 운동 목록 세팅
    useEffect(() => {
        if (type2) {
            setExerciseList(exercises.filter(e => e.type1 === type1 && e.type2 === type2));
        } else {
            setExerciseList([]);
        }
    }, [type2, type1, exercises]);

    // ✅ 업데이트 요청
    const updateExercise = async (data) => {
        try {
            const today = new Date();
            const start = new Date(data.startingDate);
            const end = new Date(data.completeDate);

            let status = "SCHEDULED";
            if (today >= start && today <= end) status = "ONGOING";
            if (today > end) status = "SUCCESS";

            const payload = { ...data, status };

            await fetcher(`http://localhost:8080/api/exercise/updateGoal/${exerciseGoalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            alert("수정 완료");
            navigate("/exercise/goal");
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit(updateExercise)}>
                <h1>운동목표 수정하기</h1>
                <div>
                    <label>운동 유형</label>
                    <select value={type1} onChange={(e) => setType1(e.target.value)}>
                        <option value="">운동 유형 선택</option>
                        {cat1.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>운동 분류</label>
                    <select value={type2} onChange={(e) => setType2(e.target.value)}>
                        <option value="">운동 분류 선택</option>
                        {cat2.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>운동</label>
                    <select {...register("name", { required: true })}>
                        <option value="">운동 선택</option>
                        {exerciseList.map((e, index) => (
                            <option key={index} value={e.name}>{e.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>무게 목표</label>
                    <input type="number" {...register("weightGoal", { required: "목표 무게를 입력하세요." })} />
                </div>

                <div>
                    <label>개수 목표</label>
                    <input type="number" {...register("countGoal", { required: "목표 개수를 입력하세요." })} />
                </div>

                <div>
                    <label>거리 목표</label>
                    <input type="number" {...register("distanceGoal", { required: "목표 거리를 입력하세요." })} />
                </div>

                <div>
                    <label>시간 목표</label>
                    <input type="number" {...register("timeGoal", { required: "목표 시간을 입력하세요." })} />
                </div>

                <div>
                    <label>시작일</label>
                    <input type="date" {...register("startingDate", { required: "시작일을 입력하세요." })} />
                </div>

                <div>
                    <label>완료 예정일</label>
                    <input type="date" {...register("completeDate", { required: "완료일을 입력하세요." })} />
                </div>

                <div>
                    <input type="submit" value="수정하기" />
                    <input type="button" value="목록" onClick={() => navigate("/exercise/goal")} />
                </div>
            </form>
        </div>
    );
}
