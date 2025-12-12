import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiChatPage() {
    // Chat State
    const [messages, setMessages] = useState([]); // { role: 'user' | 'ai', text: string }
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Draggable State
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const buttonStartRef = useRef({ x: 0, y: 0 });
    const isDragAction = useRef(false); // To distinguish click vs drag

    // Utils for Chat
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    // Listen for Auth Changes (Login/Logout)
    useEffect(() => {
        const handleAuthChange = () => {
            setMessages([]);
            setInput("");
            setIsOpen(false);
            // Optional: You could fetch the new user name here if you wanted to greet them
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, []);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: userMsg }),
            });

            if (!res.ok) throw new Error(`Server Error (${res.status})`);

            const data = await res.json();
            const aiReply = data.reply ?? "(답변이 없습니다)";

            setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'ai', text: "AI가 응답하지 않습니다. 잠시 후 다시 시도해주세요." }]);
        } finally {
            setLoading(false);
        }
    };

    // Drag Handlers
    const handleMouseDown = (e) => {
        // Only left click
        if (e.button !== 0) return;

        setIsDragging(true);
        isDragAction.current = false;

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        buttonStartRef.current = { ...position };

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';

        // Add global listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        // If moved more than 5 pixels, consider it a drag
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isDragAction.current = true;
        }

        setPosition({
            x: buttonStartRef.current.x + deltaX,
            y: buttonStartRef.current.y + deltaY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Snap to bounds logic could go here if curious
    };

    const toggleChat = () => {
        if (!isDragAction.current) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div style={{ position: 'fixed', left: 0, top: 0, width: 0, height: 0, zIndex: 9999 }}>

            {/* Chat Window */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        left: position.x - 450, // Updated offset for wider window
                        top: position.y - 600, // Updated offset for taller window
                        width: '480px', // Increased width
                        height: '600px', // Increased height
                        backgroundColor: '#fff',
                        borderRadius: '20px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #f0f0f0',
                        // Responsive safety: ensure it's on screen
                        transform: `translate(${Math.min(0, window.innerWidth - (position.x + 40))}px, 0)`
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '15px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>🤖 AI Health Coach</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.4rem' }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#aaa', marginTop: '40%' }}>
                                <p style={{ fontSize: '1.1rem' }}>안녕하세요!<br />건강에 대해 무엇이든 물어보세요.</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '14px 18px',
                                    borderRadius: '18px',
                                    backgroundColor: msg.role === 'user' ? '#007bff' : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#333',
                                    boxShadow: msg.role === 'ai' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '18px',
                                    lineHeight: '1.6',
                                    fontSize: '1rem',
                                    overflowWrap: 'break-word'
                                }}>
                                    {msg.role === 'ai' ? (
                                        <div className="markdown-body">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ padding: '12px 16px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <span className="jumping-dots">typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지 입력..."
                            style={{
                                flex: 1,
                                padding: '12px 18px',
                                borderRadius: '25px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            style={{
                                marginLeft: '10px',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                border: 'none',
                                background: input.trim() ? '#007bff' : '#e0e0e0',
                                color: 'white',
                                cursor: input.trim() ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <div
                onMouseDown={handleMouseDown}
                onClick={toggleChat}
                style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)',
                    transition: isDragging ? 'none' : 'transform 0.2s',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)',
                    zIndex: 10000,
                    userSelect: 'none'
                }}
            >
                🤖
            </div>

            {/* Simple CSS for loading dots + Markdown Tables */}
            <style>{`
                @keyframes jump {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0); }
                }
                .jumping-dots {
                    font-size: 0.8rem;
                    color: #888;
                    animation: jump 1s infinite;
                }
                
                /* Basic Markdown Styles for Chat */
                .markdown-body p { margin-bottom: 0.8em; }
                .markdown-body p:last-child { margin-bottom: 0; }
                .markdown-body ul, .markdown-body ol { margin-left: 1.2em; margin-bottom: 0.8em; }
                .markdown-body table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-bottom: 0.8em; 
                    font-size: 0.9em;
                }
                .markdown-body th, .markdown-body td { 
                    border: 1px solid #ddd; 
                    padding: 6px 10px; 
                    text-align: left; 
                }
                .markdown-body th { background-color: #f2f2f2; font-weight: 600; }
                .markdown-body code { 
                    background-color: #f0f0f0; 
                    padding: 2px 4px; 
                    border-radius: 4px; 
                    font-family: monospace; 
                }
                .markdown-body strong { font-weight: 700; color: #000; }
            `}</style>
        </div>
    );
}
