import { useEffect, useState } from "react";
import { fetcher } from "../../lib/fetcher";
import { useForm } from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";

export default function UpdatePhysicalGoal() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [physical, setPhysical] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const physicalId = params?.id;

    useEffect(() => {
        (async () => {
            const data = await fetcher("http://localhost:8080/api/physical/goal");
            if (data) {
                setPhysical(data); // 배열의 첫 번째 객체만 저장
            }
        })();
    }, []);

    useEffect(() => {
        if (physical) {
            setValue("kgGoal", physical.kgGoal);
            setValue("startingDate", physical.startingDate);
            setValue("completeDate", physical.completeDate);
            setValue("status", physical.status);
        }
    }, [physical, setValue]);

    const updatePhysical = async (data) => {
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
            await fetcher(`http://localhost:8080/api/physical/${physicalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            alert("수정 완료");
            navigate("/physical/goal");
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(updatePhysical)}>
                <h1>목표 수정하기</h1>

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
                    <input type="submit" value="수정하기" />
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
