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
            navigate("/workout/physical/goal");
        } catch (error) {
            console.error(error);
            alert("생성 실패");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                maxWidth: "600px",
                margin: "0 auto",
                marginTop: "30px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <form
                onSubmit={handleSubmit(createPhysical)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >
                <h1
                    style={{
                        marginBottom: "25px",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#007bff"
                    }}
                >
                    목표 생성하기
                </h1>

                {/* 목표 몸무게 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>목표 몸무게(kg)</label>
                    <input
                        type="number"
                        {...register("kgGoal", { required: "목표 몸무게를 입력하세요." })}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none"
                        }}
                    />
                    {errors.kgGoal && (
                        <small style={{ color: "red" }}>{errors.kgGoal.message}</small>
                    )}
                </div>

                {/* 시작일 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>시작일</label>
                    <input
                        type="date"
                        {...register("startingDate", { required: "시작일을 입력하세요." })}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none"
                        }}
                    />
                    {errors.startingDate && (
                        <small style={{ color: "red" }}>{errors.startingDate.message}</small>
                    )}
                </div>

                {/* 완료 예정일 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", color: "#333" }}>완료 예정일</label>
                    <input
                        type="date"
                        {...register("completeDate", { required: "완료일을 입력하세요." })}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #007bff",
                            outline: "none"
                        }}
                    />
                    {errors.completeDate && (
                        <small style={{ color: "red" }}>{errors.completeDate.message}</small>
                    )}
                </div>

                {/* 버튼 영역 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginTop: "20px"
                    }}
                >
                    <button
                        type="submit"
                        style={{
                            padding: "12px 24px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold"
                        }}
                    >
                        생성하기
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/workout/physical/goal")}
                        style={{
                            padding: "12px 24px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold"
                        }}
                    >
                        목록
                    </button>
                </div>
            </form>
        </div>
    );
}