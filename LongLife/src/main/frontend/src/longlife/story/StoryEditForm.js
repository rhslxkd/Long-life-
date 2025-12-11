import React, {useEffect, useState} from "react";
import noImage from "../../assets/images/noImage.png";
import { fetcher } from "../../lib/fetcher";

export default function StoryEditForm({ onClose, onSaved, initialData}) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [imgUrl, setImgUrl] = useState(initialData?.imgUrl || null);
    const [exerciseList, setExerciseList] = useState([]);
    const [preview, setPreview] = useState(
        initialData?.imgUrl ? `http://localhost:8080/uploads/${initialData.imgUrl}` : noImage
    );
    const [pId,setPId] = useState(initialData?.postId);
    const [uId,setUid] = useState(initialData?.userId);

    const [exerciseId, setExerciseId] = useState(
        initialData?.exerciseId?.exerciseId || initialData?.exerciseId || ""
    );


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

    const [updatedAt] = useState(getToday());

    //운동 목록 로딩
    useEffect(() => {
        const loadExercise = async () => {
            try {
                const data = await fetcher(`http://localhost:8080/api/exercise`);
                setExerciseList(data);
            } catch (e) {
                console.error("운동 목록 오류:", e);
            }
        };
        loadExercise();
    }, []);



    // 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setImgUrl(file);
    };


    // 수정저장 핸들러2
    const handleEdit = async () => {
        const formData = new FormData();
        // 서버가 요구하는 post(JSON 문자열)
        // const postObj = {
        //     title,
        //     content,
        //     exerciseId: exerciseId?.exerciseId,
        //     updatedAt
        // };
        const postObj = {
            title,
            content,
            exerciseId,  // 숫자 그대로
            updatedAt
        };

        formData.append(
            "post",
            new Blob([JSON.stringify(postObj)], { type: "application/json" })
        );

        // 이미지가 파일일 때만 추가
        if (imgUrl instanceof File) {
            formData.append("imgfile", imgUrl);
        }

        try {
            await fetcher(`http://localhost:8080/api/post/${pId}`, {
                method: "PUT",
                body: formData,
            });
            onSaved();
        } catch (err) {
            alert(exerciseId.exerciseId);
            alert("저장 중 오류가 발생했습니다.");
        }
    };


    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    width: "700px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
            >
                <h4>스토리 수정</h4>

                {/* 가로 레이아웃 */}
                <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                    {/* 이미지 영역 */}
                    <div style={{ flex: "1", textAlign: "center" }}>
                        <img
                            src={preview}
                            alt="preview"
                            style={{
                                width: "100%",
                                height: "260px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                            }}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginTop: "10px" }}
                        />
                    </div>

                    {/* 텍스트 입력 영역 */}
                    <div style={{flex: "2"}}>
                        <div className="mb-3">
                            <label><strong>제목</strong></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-control"
                            />
                        </div>


                        <div className="mb-3">
                            <label><strong>연습종목</strong></label>
                            {/*<select*/}
                            {/*    className="form-select"*/}
                            {/*    value={exerciseId}*/}
                            {/*    onChange={(e) => setExerciseId(e.target.value)}*/}
                            {/*>*/}
                            {/*    <option value="">-Exercise종목-</option>*/}
                            {/*    {exerciseList.map((ex) => (*/}
                            {/*        <option key={ex.exerciseId} value={ex.exerciseId}>*/}
                            {/*            {ex.name}*/}
                            {/*        </option>*/}
                            {/*    ))}*/}
                            {/*</select>*/}
                            <select
                                className="form-select"
                                value={exerciseId}
                                onChange={(e) => setExerciseId(Number(e.target.value))}
                            >
                                <option value="">-Exercise종목-</option>
                                {exerciseList.map((ex) => (
                                    <option key={ex.exerciseId} value={ex.exerciseId}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>


                        </div>
                        <div className="mb-3">
                            <label><strong>내용</strong></label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="form-control"
                                rows="8"
                                style={{resize: "none"}}
                            />
                        </div>
                    </div>
                </div>
                <div>작성자:{uId}</div>
                {/* 버튼 영역 */}
                <div className="d-flex gap-2 mt-3" style={{marginTop: "20px"}}>
                    <button className="btn btn-secondary" onClick={onClose}>닫기</button>
                    <button className="btn btn-primary" onClick={handleEdit}>수정</button>
                </div>
            </div>
        </div>
    );
}
