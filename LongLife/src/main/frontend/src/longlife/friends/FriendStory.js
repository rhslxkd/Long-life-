import React, {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import InfiniteScroll from "react-infinite-scroll-component";
import Pagination from "../../components/pagination";
import noImage from "../../assets/images/noImage.png";
import {set} from "react-hook-form";

export default function FriendStory() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadPosts = async () => {
        setLoading(true);
        setErr(null);

        try {
            const data = await fetcher(`http://localhost:8080/api/post/friendStory?page=${page - 1}`);
            console.log(data.content);

            if (data.content.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts((prev) => [...prev, ...data.content]);
            setPage((prev) => prev + 1)
        } catch (e) {
            setErr(e.message);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadPosts(1);
        })();
    }, []);

    if (err) return <div className="text-danger">{err}</div>

    const handleLikeClick = async (postId) => {
        try {
            const data = await fetcher(`http://localhost:8080/api/like/${postId}`, {
                method: 'POST'
            });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId
                        ? {
                            ...post,
                            likedByUser: data.isLike, // 서버에서 받은 값으로 갱신
                            likeCount: post.likeCount + (data.isLike ? 1 : -1) // 낙관적 업데이트
                        }
                        : post
                )
            );
        } catch (e) {
            setErr(e.message);
        }
    }

    return (
        <div className="container" style={{maxWidth: 800}}>
            <h1 className="mt-4 mb-4">친구 스토리 목록</h1>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadPosts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p className="text-center">모든 데이터를 불러왔습니다</p>}
            >
                {/* 게시글 리스트 */}
                {posts.map((p) => (
                    <div className="card mb-4 shadow-sm" key={p.postId}>
                        <div className="card-body">
                            <h6 className="text-secondary small">작성자: {p.writer}</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <img src={p.imgUrl ? `http://localhost:8080/uploads/${p.imgUrl}` : noImage}
                                         alt={p.title || "no image"}
                                         style={{
                                             maxWidth: "100%",
                                             maxHeight: "100%",
                                             objectFit: "contain",
                                         }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h5 className="fw-bold mt-2">#{p.title}</h5>
                                    <p style={{whiteSpace: "pre-line"}}>{p.content}</p>
                                </div>
                            </div>
                            {/* 날짜 */}
                            <div className="mt-3 text-muted small">
                                <span>작성일: {p.createdAt}</span>
                            </div>
                            <hr/>
                            {/* 좋아요 */}
                            <button className={`btn btn-sm ${p.likedByUser ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={() => handleLikeClick(p.postId)}>
                                <i className="fa-regular fa-heart"></i>({p.likeCount})
                            </button>
                            {/* 댓글 */}
                            <div className="input-group mt-3">
                                <input type="text" className="form-control" placeholder="댓글 작성..."/>
                                <button className="btn btn-outline-primary">등록</button>
                            </div>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}