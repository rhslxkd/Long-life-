import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Calendar() {
    const today = new Date();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    // 팝업에서 임시로 선택한 연/월 상태
    const [tempYear, setTempYear] = useState(today.getFullYear());
    const [tempMonth, setTempMonth] = useState(today.getMonth());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => {
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const handleDateClick = (dateObj) => {
        setSelectedDate(dateObj);
    };

    // "확인" 버튼 눌렀을 때만 적용
    const applyYearMonth = () => {
        setCurrentDate(new Date(tempYear, tempMonth, 1));
        setShowPopup(false);
    };

    // 달력 날짜 배열 (앞뒤 달 포함)
    const calendarDays = [];
    const startDay = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
        calendarDays.push({date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false});
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        calendarDays.push({date: new Date(year, month, i), isCurrentMonth: true});
    }
    const nextDaysCount = 42 - calendarDays.length;
    for (let i = 1; i <= nextDaysCount; i++) {
        calendarDays.push({date: new Date(year, month + 1, i), isCurrentMonth: false});
    }

    const years = Array.from({length: 11}, (_, i) => year - 5 + i);
    const months = Array.from({length: 12}, (_, i) => i);

    return (

        <div>
            <div style={{
                width: "600px",
                margin: "40px auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                position: "relative"
            }}>
                {/* 오른쪽 상단 오늘 버튼 */}
                <button
                    onClick={goToday}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "none",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer"
                    }}
                >
                    오늘
                </button>

                {/* 월 표시와 좌우 버튼 */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                    fontSize: "1.5rem",
                    fontWeight: "bold"
                }}>
                    <button onClick={prevMonth} style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        marginRight: "20px"
                    }}>◀
                    </button>

                    <span onClick={() => {
                        setTempYear(year);
                        setTempMonth(month);
                        setShowPopup(true);
                    }} style={{cursor: "pointer", userSelect: "none"}}>
          {year}년 {month + 1}월
        </span>

                    <button onClick={nextMonth} style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        marginLeft: "20px"
                    }}>▶
                    </button>
                </div>

                {/* 달력 */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gridTemplateRows: "auto repeat(6, 1fr)",
                    gap: "2px"
                }}>
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <div key={day} style={{textAlign: "center", fontWeight: "bold", padding: "5px"}}>{day}</div>
                    ))}

                    {calendarDays.map((dayObj, idx) => {
                        const {date, isCurrentMonth} = dayObj;
                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    const formDate = date.toISOString().split("T")[0];
                                    navigate(`/workout/session/${formDate}`);
                                }}
                                style={{
                                    border: "1px solid #ccc",
                                    aspectRatio: "1 / 1",
                                    padding: "5px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    color: isCurrentMonth ? "black" : "gray",
                                    backgroundColor: isSelected ? "#ffe4b5" : isToday ? "#f0f8ff" : "white",
                                }}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>


                {/* 팝업 모달 */}
                {showPopup && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100
                    }}>
                        <div style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            minWidth: "300px"
                        }}>
                            <h3>연·월 선택</h3>
                            <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                                <select value={tempYear} onChange={(e) => setTempYear(parseInt(e.target.value))}>
                                    {years.map((y) => <option key={y} value={y}>{y}년</option>)}
                                </select>
                                <select value={tempMonth} onChange={(e) => setTempMonth(parseInt(e.target.value))}>
                                    {months.map((m) => <option key={m} value={m}>{m + 1}월</option>)}
                                </select>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <button onClick={() => setShowPopup(false)} style={{marginRight: "10px"}}>취소</button>
                                <button onClick={applyYearMonth}>확인</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;
