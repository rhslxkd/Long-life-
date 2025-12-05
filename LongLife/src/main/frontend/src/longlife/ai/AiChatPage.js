import { useState } from "react";

export default function AiChatPage() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setError("");
        // setReply(""); // 답변 올 때까지 이전 답변 유지하는 게 UX상 나을 수도 있어. 취향껏.

        try {
            const res = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // [핵심] 이 옵션이 있어야 '게스트 세션 ID(JSESSIONID)'가 스프링으로 넘어감!
                credentials: "include",
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                // 에러 나면 상태 코드로 메시지 보여주기
                throw new Error(`서버 에러 (${res.status})`);
            }

            const data = await res.json();
            setReply(data.reply ?? "(답변이 없습니다)");

            // 전송 성공하면 입력창 비우기 (채팅 앱의 기본이지)
            setMessage("");

        } catch (err) {
            console.error(err);
            setError("AI가 응답하지 않습니다. 서버가 켜져 있나요?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🤖 AI 헬스 코치</h2>

            {/* 채팅 영역 (답변이 위에 쌓이는 게 보통이지만, 일단 네 구조대로) */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <textarea
                    rows={4}
                    style={{
                        width: "100%",
                        resize: "vertical",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                    }}
                    placeholder="운동 루틴이나 건강 고민을 물어보세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        // 엔터키 누르면 전송 (Shift+Enter는 줄바꿈)
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    style={{
                        marginTop: 10,
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: loading ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        float: "right"
                    }}
                >
                    {loading ? "생각 중... 🤔" : "보내기 🚀"}
                </button>
            </form>

            <div style={{ clear: "both", paddingTop: "20px" }}>
                {error && (
                    <div style={{ color: "red", padding: "10px", background: "#ffe6e6", borderRadius: "4px" }}>
                        {error}
                    </div>
                )}

                {reply && (
                    <div style={{ animation: "fadeIn 0.5s" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>AI의 답변:</h4>
                        <div
                            style={{
                                whiteSpace: "pre-wrap",
                                padding: "20px",
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                background: "#f9f9f9",
                                lineHeight: "1.6",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                            }}
                        >
                            {reply}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}