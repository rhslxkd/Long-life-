import React, { useState, useEffect } from "react";
import {fetcher} from "../../lib/fetcher";
import CommentItem from "./CommentItem";

export default function CommentList({ postId, userId, mode }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    // 댓글 조회
    const loadComments = async () => {
        const data = await fetcher(`http://localhost:8080/api/comment/${postId}`);
        setComments(data);
    };

    // 댓글 작성
    const addComment = async () => {
        if (!content.trim()) return;
        await fetcher(`http://localhost:8080/api/comment`, {
            method: "POST",
            body: JSON.stringify({
                postId,
                userId,
                content,
                parentId: null,
            }),
            headers: { "Content-Type": "application/json" },
        });

        setContent("");
        await loadComments();
    };

    useEffect(() => {
        loadComments();
    }, []);

    return (
        <div className="mt-3">
            {/* mode === friendStory 일 때만 댓글 입력창 보이기 */}
            {mode === "friendStory" && (
                <div className="input-group mb-3">
                    <input
                        className="form-control"
                        placeholder="댓글을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" onClick={addComment}>
                        등록
                    </button>
                </div>
            )}

            {/* 댓글 목록 */}
            <div>
                {comments.length === 0 ? (
                    <div className="text-muted small">댓글이 없습니다.</div>
                ) : (
                    comments.map((c) => (
                        <CommentItem
                            key={c.commentId}
                            comment={c}
                            postId={postId}
                            userId={userId}
                            reload={loadComments}
                            mode={mode}
                        />
                    ))
                )}
            </div>
        </div>
    );
}