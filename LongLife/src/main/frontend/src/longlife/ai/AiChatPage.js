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
        setReply("");

        try {
            const res = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Spring Security 세션 쿠키 쓰니까 이거 중요
                credentials: "include",
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            setReply(data.reply ?? "(빈 답변)");
        } catch (err) {
            console.error(err);
            setError("AI 서버 호출 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "40px auto" }}>
            <h2>AI 운동 추천 / 채팅</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <textarea
            rows={4}
            style={{ width: "100%", resize: "vertical" }}
            placeholder="AI에게 물어볼 내용을 적어줘..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    style={{ marginTop: 10 }}
                >
                    {loading ? "생각 중..." : "보내기"}
                </button>
            </form>

            {error && (
                <div style={{ color: "red", marginBottom: 16 }}>
                    {error}
                </div>
            )}

            {reply && (
                <div
                    style={{
                        whiteSpace: "pre-wrap",
                        padding: 16,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        background: "#fafafa",
                    }}
                >
                    {reply}
                </div>
            )}
        </div>
    );
}