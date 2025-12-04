import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function CreateExerciseGoal() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [exercise, setExercise] = useState([]);
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [type1, setType1] = useState("");
    const [type2, setType2] = useState("");
    const [err, setErr] = useState(null);

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

    const createExercise = async (data) => {
        try {
            const today = new Date();
            const start = new Date(data.startingDate);
            const end = new Date(data.completeDate);

            let status = "SCHEDULED"; // 기본값

            if (today < start) {
                status = "SCHEDULED";
            } else if (today >= start && today <= end) {
                status = "ONGOING";
            } else if (today > end) {
                status = "SUCCESS";
            }

            const payload = {
                ...data,
                status,
            };
            console.log(payload);
            await fetcher(`http://localhost:8080/api/exercise/createGoal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            alert("생성 완료");
            navigate("/exercise/goal");
        } catch (error) {
            console.error(error);
            alert("생성 실패");
        }
    };

    return(
        <div>
            <h1>운동일지 추가하기</h1>
            <form onSubmit={handleSubmit(createExercise)}>
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
                    <select {...register("name", { required: true })}>
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
                    <label>무게 목표</label>
                    <input type="number"
                           {... register("weightGoal", {required:"목표 무게를 입력하세요."})}/>
                    {errors.weightGoal && <small>{errors.weightGoal.message}</small>}
                </div>
                <div>
                    <label>개수 목표</label>
                    <input
                        type="number"
                        {...register("countGoal", { required: "목표 개수를 입력하세요." })}
                    />
                    {errors.countGoal && <small>{errors.countGoal.message}</small>}
                </div>
                <div>
                    <label>거리 목표</label>
                    <input
                        type="number"
                        {...register("distanceGoal", { required: "목표 거리를 입력하세요." })}
                    />
                    {errors.distanceGoal && <small>{errors.distanceGoal.message}</small>}
                </div>
                <div>
                    <label>시간 목표</label>
                    <input
                        type="number"
                        {...register("timeGoal", { required: "목표 시간을 입력하세요." })}
                    />
                    {errors.timeGoal && <small>{errors.timeGoal.message}</small>}
                </div>
                <div>
                    <label>시작일</label>
                    <input
                        type="date"
                        {...register("startingDate", { required: "시작일을 입력하세요." })}
                    />
                    {errors.startingDate && <small>{errors.startingDate.message}</small>}
                </div>

                <div>
                    <label>완료 예정일</label>
                    <input
                        type="date"
                        {...register("completeDate", { required: "완료일을 입력하세요." })}
                    />
                    {errors.completeDate && <small>{errors.completeDate.message}</small>}
                </div>

                <div>
                    <input type="submit" value="추가하기" />
                    <input
                        type="button"
                        value="목록"
                        onClick={() => navigate("/exercise/goal")}
                    />
                </div>
            </form>
        </div>
    )
}