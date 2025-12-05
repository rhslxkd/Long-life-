import React, { useState ,useEffect} from "react";

export default function PostStory(){

    const[post,setPost] = useState([]);
    const[loading,setLoading] = useState(true);

    useEffect(() => {
        async function postData() {
            try {
                const postR = await fetch(`http://localhost:8080/api/post/story`);
                const result = await postR.json();

                if (result) {
                    setPost(result);  // 안전 처리

                    console.log("API RESULT:", result);
                }
            } catch (e) {
                console.error("POST API ERROR: ", e);
                setPost([]);
            } finally {
                setLoading(false);
            }
        }

        postData();
    }, []);



    return(
      <div>
          <p align="center"><h5>운동스토리</h5></p>
          {loading ? (
              <span>로딩중입니다.</span>
          ): (
              <table className="table">
                  <thead>
                  <tr>
                      <th>ID</th>
                      <th>작성자ID</th>
                      <th>게시글제목</th>
                      {/*<th>연습ID</th>*/}
                      <th>이미지경로</th>
                      <th>게시글 내용</th>
                      <th>글작성일시</th>
                      <th>글수정일시</th>
                      <th>조회수</th>
                  </tr>
                  </thead>
                  <tbody>
                  {post.map(p => (
                      <tr key={p.postId}>
                          <td>{p.postId}</td>
                          <td>{p.userId}</td>
                          <td>{p.title}</td>
                          {/*<td>{p.exerciseId}</td>*/}
                          <td>
                              {/* public 폴더 기준 imgUrl 사용 */}
                              {p.imgUrl ? (
                                  <img
                                      src={p.imgUrl}
                                      alt="건강"
                                      style={{width: "80px", height: "80px", objectFit: "cover"}}
                                  />
                              ) : (
                                  "이미지 없음"
                              )}
                          </td>
                          <td>{p.content}</td>
                          <td>{p.createdAt}</td>
                          <td>{p.updatedAt}</td>
                          <td>{p.viewCount}</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          )}


      </div>
    );

}