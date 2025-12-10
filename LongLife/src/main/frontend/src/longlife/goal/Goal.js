import React from "react";
import { useNavigate } from "react-router-dom";
import exerciseGoal from "../../assets/images/exerciseGoal.jpg";
import physicalGoal from "../../assets/images/physicalGoal.jpg";

export default function Goal() {
    const navigate = useNavigate();

    const sectionStyle = {
        flex: 1,
        position: "relative",
        height: "100vh",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.3s, filter 0.3s", // 애니메이션 효과
        overflow: "hidden",
    };

    const imageStyle = (imageUrl) => ({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.5,
        zIndex: 1,
        transition: "transform 0.3s, filter 0.3s",
    });

    const textStyle = {
        position: "relative",
        zIndex: 2,
        color: "#000",
        textAlign: "center",
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* 왼쪽 영역 */}
            <div
                style={sectionStyle}
                onClick={() => navigate("/workout/exercise/goal")}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "brightness(1)";
                }}
            >
                <div style={imageStyle(exerciseGoal)} />
                <div style={textStyle}>
                    <h2>나의 운동목표</h2>
                    <p>운동을 직접 선택하고 자세하게 목표를 정할 수 있습니다.</p>
                </div>
            </div>

            {/* 오른쪽 영역 */}
            <div
                style={sectionStyle}
                onClick={() => navigate("/workout/physical/goal")}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "brightness(1)";
                }}
            >
                <div style={imageStyle(physicalGoal)} />
                <div style={textStyle}>
                    <h2>나의 체중목표</h2>
                    <p>본인의 체중과 여러 지표들을 기반으로 체중 관리를 할 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
}
