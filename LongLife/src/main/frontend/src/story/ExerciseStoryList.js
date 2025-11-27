import React, {useState} from "react";
import "../css/App.css";
import "../css/board.css";
import "../css/forbiddenPage.css";

const initialStories = [
    // {id: 1, author: "홍길동", content: "오늘 5km 달리기 성공! 체중이 0.5g정도 줄어든 느낌이다. 나지막한 오르막길을 오르고 내리막길을 내려가면서" +
    //         " 혈액순환이 원활하게 이뤄지는 느낌이 들었고, 땀배출이 되면서 시원한 바람과 함께 매우 상쾌하였다.", likes: 0, comments: []}
];

function ExerciseStoryList() {
    const [stories, setStories] = useState(initialStories);
    const [searchTerm, setSearchTerm] = useState("");
    const [newStory, setNewStory] = useState("");

    const handleLike = (id) => {
        setStories(
            stories.map((story) =>
                story.id === id ? {...story, likes: story.likes + 1} : story
            )
        );
    };

    const handleAddComment = (storyId, commentText, parentId = null) => {
        setStories(
            stories.map((story) => {
                if (story.id !== storyId) return story;

                const newComment = {id: Date.now(), text: commentText, replies: []};
                if (!parentId) {
                    return {...story, comments: [...story.comments, newComment]};
                } else {
                    const addReply = (comments) =>
                        comments.map((c) =>
                            c.id === parentId
                                ? {...c, replies: [...c.replies, newComment]}
                                : {...c, replies: addReply(c.replies)}
                        );
                    return {...story, comments: addReply(story.comments)};
                }
            })
        );
    };

    const handleAddStory = () => {
        if (!newStory.trim()) return;
        const newId = stories.length ? stories[stories.length - 1].id + 1 : 1;
        setStories([
            ...stories,
            {id: newId, author: "강다니엘", content: newStory, likes: 0, comments: []},
        ]);
        setNewStory("");
    };

    const filteredStories = stories.filter((story) =>
        story.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h1>운동 스토리 게시판</h1>
            <div className="new-story">
        <textarea
            placeholder="오늘의 운동 스토리를 작성하세요..."
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
        />
                <button onClick={handleAddStory}>스토리 등록</button>
                &nbsp; &nbsp;&nbsp;&nbsp;
                <input type="file" name="poster"/>
            </div>
            <br/>
            <div className="search">
                <input
                    type="text"
                    placeholder="검색어 입력..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="story-list">
                {filteredStories.map((story) => (
                    <Story
                        key={story.id}
                        story={story}
                        onLike={handleLike}
                        onAddComment={handleAddComment}
                    />
                ))}
            </div>
        </div>
    );
}

function Story({story, onLike, onAddComment}) {
    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        onAddComment(story.id, commentText);
        setCommentText("");
    };

    return (
        <div className="story">
            <p style={{fontSize: '12px'}}><h5>{story.author}</h5></p>
            <div style={{display: 'flex'}}>
                <div style={{flex: 1, border: '0px solid #ccc', padding: '10px'}}>
                    <img src={require("../asset/image/health.png")} alt="건강"/>
                </div>
                <div style={{flex: 1, border: '0px solid #ccc', padding: '10px'}}>
                    {story.content}
                </div>
            </div>
            <p style={{fontSize: '12px'}}>작성일:2025-11-25&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조회수 :
                12&nbsp;&nbsp;&nbsp;작성자:김치맨&nbsp;&nbsp;&nbsp;
                <button>삭제</button>
            </p>
            <div className="actions">
                <button onClick={() => onLike(story.id)}>좋아요({story.likes})</button>
            </div>
            <div className="comments">
                {story.comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        storyId={story.id}
                        onAddComment={onAddComment}
                    />
                ))}
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="댓글 작성..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={handleCommentSubmit}>등록</button>
                </div>
            </div>
        </div>
    );
}

function Comment({comment, storyId, onAddComment}) {
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        onAddComment(storyId, replyText, comment.id);
        setReplyText("");
        setShowReply(false);
    };

    return (
        <div className="comment-block">
            <p className="comment-text">
                <div style={{display: "flex"}}>
                    <span> {comment.text}</span>
                    <span style={{marginLeft: "auto"}}>작성자(testMan) , 2025.11.27</span>
                </div>
            </p>


            <button className="reply-btn" onClick={() => setShowReply(!showReply)}>
                답글
            </button>
            <button className="reply-btn">
                삭제
            </button>
            {showReply && (
                <div className="add-reply">
                    <input
                        type="text"
                        placeholder="답글 작성..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={handleReplySubmit}>등록</button>
                </div>
            )}
            {comment.replies.length > 0 && (
                <div className="replies">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            storyId={storyId}
                            onAddComment={onAddComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExerciseStoryList;