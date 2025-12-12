import React, { useState } from "react";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";
import FormatKST from "../../lib/FormatKST";

export default function CommentItem({ comment, postId, userId, reload, mode }) {
    const loginUser = useMe();
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    const addReply = async () => {
        if (!replyText.trim()) return;

        await fetcher(`http://localhost:8080/api/comment`, {
            method: "POST",
            body: JSON.stringify({
                postId,
                userId,
                content: replyText,
                parentId: comment.commentId,
            }),
            headers: { "Content-Type": "application/json" },
        });

        setReplyText("");
        setReplyOpen(false);
        await reload();
    };

    return (
        <div className="mb-2" style={{ marginLeft: comment.parentId ? 25 : 0 }}>

            {/* 댓글 본문 */}
            <div className="border rounded p-2 bg-light">
                <b className="ms-2">{comment.userId}</b>
                <small className="ms-2">{FormatKST(comment.createdAt).slice(0,-3)}</small>
                <div className="d-flex justify-content-between align-items-center ms-2">
                <div className="fs-5">{comment.content}</div>

                {/* 답글 버튼 */}
                {loginUser.userId !== comment.userId &&
                <button
                    className="btn btn-link btn-sm"
                    onClick={() => setReplyOpen(!replyOpen)}
                >
                    답글쓰기
                </button>
                }
                {/*추후에 추가*/}
                {/*{loginUser.userId === comment.userId &&*/}
                {/*<button   className="btn btn-outline-danger btn-sm">*/}
                {/*    삭제*/}
                {/*</button>*/}
                {/*}*/}
                </div>
            </div>

            {/* 답글 입력창 */}
            {replyOpen && (
                <div className="input-group my-2">
                    <input
                        className="form-control"
                        placeholder="댓글 입력..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addReply}>
                        등록
                    </button>
                </div>
            )}

            {/* 대댓글 렌더링 (재귀) */}
            {comment.children &&
                comment.children.map((child) => (
                    <CommentItem
                        key={child.commentId}
                        comment={child}
                        postId={postId}
                        userId={userId}
                        reload={reload}
                        mode={mode}
                    />
                ))}
        </div>
    );
}