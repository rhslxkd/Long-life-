import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../lib/fetcher";
import { useForm } from "react-hook-form";
import React from "react";
import useMe from "../../hooks/useMe";
import noImage from "../../assets/images/noImage.png";
import StoryEditForm from "./StoryEditForm";

export default function StoryList() {
    const user = useMe();
    const navigate = useNavigate();

    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [poster, setPoster] = useState(null);
    const [preview, setPreview] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [exerciseId, setExerciseId] = useState("");
    const [exerciseList, setExerciseList] = useState([]);

    //수정 삭제를 위한 상영회차 넘기기 위한 변수
    const [selectedStory,setSelectedStory] =useState(null);
    const [openForm,setOpenForm] = useState(false); //처음에는 일단 비활성화

    const getToday = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const [createdAt] = useState(getToday());
    const [updatedAt] = useState(getToday());
    const [userId] = useState(user.userId);

    const onChangePoster = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPoster(null);
            setPreview("");
            return;
        }
        setPoster(file);
        setPreview(URL.createObjectURL(file));
    };

    const loadPost = useCallback(async () => {
        try {
            const data = await fetcher(`http://localhost:8080/api/post/story`);
            if (!data) return;
            setPost(data);
        } catch (e) {
            if (e.status === 403) {
                navigate("/forbidden");
                return;
            }
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        (async () => await loadPost())();
    }, [loadPost]);

    // 검색
    const searchPost = useCallback(async () => {
        try {
            const query = searchTerm.trim();

            if (query === "") {
                await loadPost();
                return;
            }

            const url = `http://localhost:8080/api/post/search?searchData=${query}`;
            const data = await fetcher(url);
            setPost(data);
        } catch (e) {
            console.error("검색 오류:", e);
            setErr(e.message);
        }
    }, [searchTerm, loadPost]);

    useEffect(() => {
        const delay = setTimeout(() => searchPost(), 400);
        return () => clearTimeout(delay);
    }, [searchTerm, searchPost]);

    //운동 목록 로딩
    useEffect(() => {
        const loadExercise = async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/post/exerciseId");
                setExerciseList(data);
            } catch (e) {
                console.error("운동 목록 오류:", e);
            }
        };
        loadExercise();
    }, []);

    // 스토리 등록
    const addPost = () => {

        if(!title){
            alert("제목은 반드시 입력하셔야 합니다.");
            return;
        }

        if (!exerciseId) {
            alert("Exercise 종목을 선택하세요!");
            return;
        }

        if(!content){
            alert("내용도 반드시 입력하셔야 합니다.");
            return;
        }


        const form = new FormData();
        const data = { userId, title, content, exerciseId, createdAt, updatedAt };
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: "application/json" });
        form.append("post", blob);

        if (poster) form.append("poster", poster);

        (async () => {
            await fetcher(`http://localhost:8080/api/post/create`, {
                method: "POST",
                body: form
            });
            navigate(0);
        })();
    };


    //수정
    const handleEditClick = (p) => {
        // alert(`수정버튼을 클릭하셨습니다.id=`+st.showtimeId);
        setSelectedStory(p);
        setOpenForm(true); //팝업창 띄움
    }


    //저장 콜백버튼
    const handleSaved = () => {
        setOpenForm(false);
        (async () => {
            await loadPost();
        })();
    }


    // 삭제
    const handleDeleteClick = async (st) => {
        if (!window.confirm("게시물을 삭제하시겠습니까?")) return;
        try {
            await fetcher(`http://localhost:8080/api/post/${st.postId}`,
                { method: "DELETE" });
            await loadPost();
        } catch (e) {
            setErr(e.message);
        }
    };

    return (
        <div className="container my-5">

            {/* 제목 */}
            <h2 className="fw-bold text-center mb-4">운동 스토리 게시판</h2>

            {/* 글 작성 박스 */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">

                    {/* 제목 + 운동 선택 */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="제목 입력..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <select
                                className="form-select"
                                value={exerciseId}
                                onChange={(e) => setExerciseId(e.target.value)}
                            >
                                <option value="">-Exercise종목-</option>
                                {exerciseList.map((ex) => (
                                    <option key={ex.exerciseId} value={ex.exerciseId}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 내용 */}
                    <textarea
                        className="form-control mb-3"
                        placeholder="운동스토리내용 작성..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ height: "100px" }}
                    />

                    {/* 파일 + 등록 버튼 */}
                    <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={addPost}>스토리 등록</button>
                        <input type="file" className="form-control w-50" onChange={onChangePoster} />
                    </div>

                </div>
            </div>

            {/* 검색 */}
            <input
                type="text"
                className="form-control mb-4"
                placeholder="검색어 입력..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <span>로딩중....</span>
            ) : (
           <div>
                {/* 게시글 리스트 */}
            {post.map((p) => (
                <div className="card mb-4 shadow-sm" key={p.postId}>
            <div className="card-body">

                <h6 className="text-secondary small">작성자: {p.userId}</h6>

                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={
                                p.imgUrl
                                    ? `http://localhost:8080/uploads/${p.imgUrl}`
                                    : noImage
                            }
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
                        <p style={{ whiteSpace: "pre-line" }}>{p.content}</p>
                    </div>
                </div>

                {/* 날짜 */}
                <div className="mt-3 text-muted small">
                    <span>작성일: {p.createdAt}</span>
                </div>

                {/* 수정/삭제 버튼 */}
                <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-primary btn-sm"  onClick={() => handleEditClick(p)}>수정</button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(p)}
                    >
                        삭제
                    </button>
                </div>

                <hr />

                {/* 좋아요 */}
                <button className="btn btn-outline-primary btn-sm">좋아요(12)</button>

                {/* 댓글 */}
                <div className="input-group mt-3">
                    <input type="text" className="form-control" placeholder="댓글 작성..." />
                    <button className="btn btn-outline-primary">등록</button>
                </div>

            </div>
        </div>

    ))}
           </div>

            )}
            {openForm && (
                <StoryEditForm onClose={() => setOpenForm(false)}
                              onSaved={handleSaved}
                              initialData={selectedStory}
                />
            )}

        </div>
    );
}