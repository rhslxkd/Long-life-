import React, {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

export default function PhysicalGoal() {
    const [physical, setPhysical] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/physical/goal");
                console.log(data);
                if (data) {
                    setPhysical(data ?? []);
                }
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        })();
    }, []);

    const calcBMI = (height, weight) => {
        if (!height || !weight) return "-";
        const h = height / 100; // cm → m 변환
        return (weight / (h * h)).toFixed(2); // 소수점 2자리
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginTop: "30px"
            }}
        >
            {/* 현재 상태 */}
            <div style={{ width: "100%", marginBottom: "30px" }}>
                <h2
                    style={{
                        marginBottom: "15px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#007bff",
                        textAlign: "center"
                    }}
                >
                    현재 나의 상태
                </h2>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>키</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>몸무게</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>BMI지수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {physical && (
                        <tr>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.height}cm
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.weight}kg
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {calcBMI(physical.height, physical.weight)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 목표 */}
            <div style={{ width: "100%" }}>
                <h2
                    style={{
                        marginBottom: "15px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#007bff",
                        textAlign: "center"
                    }}
                >
                    나의 목표
                </h2>
                {physical ? (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>목표 몸무게</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>시작 일자</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>완료 일자</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>진행 상태</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.kgGoal}kg
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.startingDate}
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.completeDate}
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                                {physical.status}
                            </td>
                            <td
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}
                            >
                                <button
                                    onClick={() =>
                                        navigate(`/workout/physical/updateGoal/${physical.physicalGoalId}`)
                                    }
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px"
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={async () => {
                                        if (window.confirm("정말 삭제할까요?")) {
                                            try {
                                                await fetcher(
                                                    `http://localhost:8080/api/physical/${physical.physicalGoalId}`,
                                                    { method: "DELETE" }
                                                );
                                            } catch (e) {
                                                alert("삭제 실패: " + e.message);
                                            }
                                        }
                                    }}
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px"
                                    }}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <p style={{ marginBottom: "10px" }}>저장된 목표가 없습니다.</p>
                        <button
                            onClick={() => navigate("/workout/physical/createGoal")}
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: "pointer",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "6px"
                            }}
                        >
                            추가
                        </button>
                    </div>
                )}
            </div>

            {/* 돌아가기 버튼 */}
            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/workout/goal")}
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
                    돌아가기
                </button>
            </div>
        </div>
    );

}