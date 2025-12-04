import {useState,useEffect,useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import {useForm} from "react-hook-form";
import React from "react";
import useMe from "../../hooks/useMe";
import "../../css/App.css";
import "../../css/board.css";
import "../../css/forbiddenPage.css";

export default function StoryList(){
    const user = useMe();
    // console.log(" 넘어온 유저 이름 ,아디 ::: " + user.name + " , " + user.userId);
    const navigate = useNavigate();

    const[post,setPost] = useState([]);
    const[loading,setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const[titleTerm, setTitleTerm] = useState("");
    const[searchTerm, setSearchTerm] = useState("");
    const[newStory, setNewStory] = useState("");
    const[poster, setPoster] = useState(null);
    const[preview, setPreview] = useState("");
    const[userId,setUserId] = useState(user.userId);
    const[title,setTitle] = useState("");
    const[content,setContent] = useState("");
    const[exerciseId,setExerciseId] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    const [exerciseList, setExerciseList] = useState([]);

    const {
        register,
        handleSubmit,
        formState: {errors}} = useForm();



    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const getToday = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
         //디비의 날짜형식이 localDateTime형식이라 이와같이 일시적으로 맞춰줌
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    // console.log("구해온 시간 ::::::" + getToday() + " exerciseId값::" + exerciseId);

    //최초입력날짜
    const[createdAt,setCreatedAt] = useState(getToday());
    //수정날짜 최초입력시에도 수정되나 수정시에는 최초날자는 입력되지 않음.
    const[updatedAt,setUpdatedAt] = useState(getToday());

    //운동 사진 올리기
    const onChangePoster = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPoster(null);
            setPreview("");
            return;
        }
        setPoster(file);
        setPreview(URL.createObjectURL(file));

    }

    //전체 운동스토리조회
    const loadPost = useCallback(async () => {
        try {
            const data = await fetcher(
                `http://localhost:8080/api/post/story`);
            if (!data) return;
            setPost(data);
        } catch (e) {
            if (e.status === 403) {
                navigate("/forbidden", {replace: true});
                return;
            }
            setErr(e.message);
        } finally {
            setLoading(false);
        }

    },[]);

    //기본1회 실행
    useEffect(() => {
        (
            async() => {
                await loadPost();
            }
        )();
    }, [loadPost]);

   //전체조회
   //  useEffect(() => {
   //      async function postData() {
   //          try {
   //              const postR = await fetch(`http://localhost:8080/api/post/story`);
   //              const result = await postR.json();
   //              if (result) {
   //                  setPost(result);  // 안전 처리 순수배열이라 .content가 없음. 페이징처리시 넣어줌.
   //                  console.log("API RESULT:", result);
   //              }
   //          } catch (e) {
   //              console.error("POST API ERROR: ", e);
   //              setPost([]);
   //          } finally {
   //              setLoading(false);
   //          }
   //      }
   //      postData();
   //  }, []);

   //검색어 조회
    const searchPost = useCallback(async () => {
        try {
            const query = searchTerm.trim();

            // 검색어 없으면 전체 조회
            if (query === "") {
                await loadPost();
                return;
            }

            // 검색 API (title, content만 전송)
            const url = `http://localhost:8080/api/post/search?searchData=${query}`;
            const data = await fetcher(url);
            setPost(data);

        } catch (e) {
            console.error("검색 오류:", e);
            setErr(e.message);
        }
    }, [searchTerm, loadPost]);

    //자동검색 시간제어
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchPost();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, searchPost]);


    //exercise_id 가져오기
    useEffect(() => {
        const loadExercise = async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/post/exercise");
                setExerciseList(data);
            } catch (e) {
                console.error("운동 목록 불러오기 오류:", e);
            }
        };
        loadExercise();
    }, []);

    //운동 스토리 등록
    const addPost = () => {
        if (!exerciseId) {
            alert("Exercise 종목을 선택하세요!");
            return;
        }
        //처리
        const form = new FormData();
        const data = {userId,title, content,exerciseId,createdAt,updatedAt};
        const json = JSON.stringify(data);
        const blob = new Blob([json],
            {type: "application/json"});
        form.append("post", blob);

        if (poster) {
            form.append("poster", poster);
        }

        (async () => {
            await fetcher(`http://localhost:8080/api/post/create`,{
                method: 'post',
                body: form
            });
            navigate('/storyList');
            navigate(0);
        })();
    }




   //삭제
    const handleDeleteClick = async(st) => {
       try{

           if(!window.confirm(`게시물을/를 삭제하시겠습니까?`)){
               return;
           }

         await fetcher(`http://localhost:8080/api/post/${st.postId}`,{
             method:'DELETE'
         });
           await loadPost();

       }catch(e){
           setErr(e.message());
       }
    }


    // 옵션 변경 이벤트
    const handleChange = (e) => {
        setExerciseId(e.target.value);
    };

    return (
        <div>
            <div className="container">
                <h1>운동 스토리 게시판</h1>
                <p style={{fontSize: '12px', display: 'flex', gap: '30px', alignItems: 'center'}}>
                    <input
                        type="text"
                        placeholder="제목 입력..."
                        value={title}
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}/>

                    <select
                        id="fruit-select"
                        value={exerciseId}
                        onChange={handleChange}
                       >
                        <option value="">-Exercise종목-</option>
                        {exerciseList.map((ex) => (
                            <option key={ex.exerciseId} value={ex.exerciseId}>
                                {ex.name}
                            </option>
                        ))}
                    </select>

                    {exerciseId && (
                        <p style={{ marginTop: "20px" }}>
                            선택한 Exercise 종목: <strong>{exerciseId}</strong>
                        </p>
                    )}


                </p>
                <div className="new-story">
                <textarea
                    placeholder="운동스토리내용 작성..."
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                    }}
                />
                        <div className="post-upload">
                            <button onClick={addPost}>스토리 등록</button>
                            <input type="file" name="imgUrl" onChange={onChangePoster}/>
                        </div>
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
            </div>
            {post.map(p => (
                <div className="story" key={p.postId}>
                    <p style={{fontSize: '12px'}}><h5>{p.userId}</h5></p>
                    <div style={{display: 'flex'}}>
                        <div style={{flex: 1, border: '0px solid #ccc', padding: '10px'}}>
                            {p.imgUrl &&
                                <>
                                    <img src={`http://localhost:8080/uploads/${p.imgUrl}`}
                                         alt="poster"
                                         style={{
                                             width: "100%",         // 부모 영역 가득
                                             height: "200px",       // 고정된 높이 → 모든 이미지 동일 높이
                                             objectFit: "contain",  // 이미지 비율 유지 + 잘리지 않음
                                             backgroundColor: "#f0f0f0", // 빈 여백 색(선택 사항)
                                             borderRadius: "8px",
                                         }}
                                    />
                                    <br/>
                                </>
                            }
                        </div>
                        <div style={{
                            whiteSpace: "pre-line",   // ← 줄바꿈(\n) 반영 핵심!
                            border: "0px solid gray",
                            padding: "10px",
                            width: "300px",
                            marginTop: "10px",
                            minHeight: "100px"
                        }}>
                            <p><h5>#{p.title}</h5></p>
                            {p.content}
                        </div>
                    </div>
                    <p style={{fontSize: '12px', display: 'flex', gap: '2px', alignItems: 'center'}}>
                        <span>작성일: {p.createdAt}</span>
                        <span>조회수: 12</span>
                        <span>작성자: {p.userId}</span>
                        <button>수정</button>
                        <button onClick={() => handleDeleteClick(p)}>삭제</button>
                    </p>
                    <div className="actions">
                    <button>좋아요(12)</button>
                    </div>
                    <div className="comments">
                        <div className="add-comment">
                            <input
                                type="text"
                                placeholder="댓글 작성..."
                                value=""
                            />
                            <buttons>등록</buttons>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

