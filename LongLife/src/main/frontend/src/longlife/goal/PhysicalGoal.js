import {useEffect, useState} from "react";
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
        <div>
            <div>
                <h2>현재 나의 상태</h2>
                <table>
                    <thead>
                    <tr>
                        <td>키</td>
                        <td>몸무게</td>
                        <td>BMI지수</td>
                    </tr>
                    </thead>
                    <tbody>
                    {physical && (
                        <tr>
                            <td>{physical.height}cm</td>
                            <td>{physical.weight}kg</td>
                            <td>{calcBMI(physical.height, physical.weight)}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <br/>
            <div>
                <h2>나의 목표</h2>
                {physical ? (
                    <table>
                        <thead>
                        <tr>
                            <td>목표 몸무게</td>
                            <td>시작 일자</td>
                            <td>완료 일자</td>
                            <td>진행 상태</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{physical.kgGoal}kg</td>
                            <td>{physical.startingDate}</td>
                            <td>{physical.completeDate}</td>
                            <td>{physical.status}</td>
                            <td>
                                <button onClick={() => navigate(`/physical/updateGoal/${physical.physicalGoalId}`)}>수정
                                </button>
                            </td>
                            <td>
                                <button onClick={async () => {
                                    if (window.confirm('정말 삭제할까요?')) {
                                        try {
                                            await fetcher(`http://localhost:8080/api/physical/${physical.physicalGoalId}`, {
                                                method: "DELETE"
                                            });
                                        } catch (e) {
                                            alert("삭제 실패: " + e.message);
                                        }
                                    }
                                }}>삭제</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <p>저장된 목표가 없습니다.</p>
                        <button onClick={() => navigate("/physical/createGoal")}>추가</button>
                    </div>
                )}
            </div>
        </div>
    );
}