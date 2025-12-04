import {useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

export default function CreatePhysicalGoal() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [physical, setPhysical] = useState([]);
    const navigate = useNavigate();

    const createPhysical = async (data) => {
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
            await fetcher(`http://localhost:8080/api/physical/createGoal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            alert("생성 완료");
            navigate("/physical/goal");
        } catch (error) {
            console.error(error);
            alert("생성 실패");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(createPhysical)}>
                <h1>목표 생성하기</h1>

                <div>
                    <label>목표 몸무게</label>
                    <input
                        type="number"
                        {...register("kgGoal", { required: "목표 몸무게를 입력하세요." })}
                    />
                    {errors.kgGoal && <small>{errors.kgGoal.message}</small>}
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
                    <input type="submit" value="생성하기" />
                    <input
                        type="button"
                        value="목록"
                        onClick={() => navigate("/physical/goal")}
                    />
                </div>
            </form>
        </div>
    );
}