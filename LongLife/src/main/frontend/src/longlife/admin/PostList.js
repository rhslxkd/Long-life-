import {useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import Pagination from "../../components/pagination";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const loadPosts = async (pageNumber = 1) => {
        const url = `http://localhost:8080/api/admin/postList?page=${pageNumber-1}`;

        setLoading(true);
        setErr(null);

        try {
            const data = await fetcher(url);
            if (!data) return;
            console.log(data.content);
            setPosts(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(pageNumber);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadPosts(1);
            // await loadPosts();
        })();
    }, []);

    if (err) return <div className="text-danger">{err}</div>
    if (!loadPosts) return <div>로딩중...</div>

    // 스토리 삭제
    const handleDeleteClick = (p) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                (async () => {
                    const result = await fetcher(`http://localhost:8080/api/post/${p.postId}`, {
                        method: "DELETE"
                    });
                    await loadPosts();
                })();
            } catch (e) {
                setErr(e.message);
            }
        }
    }

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">스토리 목록</h1>
            {/* 검색 필터 */}

            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>스토리ID</th>
                    <th>작성자</th>
                    <th>제목</th>
                    <th>생성일</th>
                    <th>수정일</th>
                    <th>비고</th>
                </tr>
                </thead>
                <tbody>
                {posts.map(post => (
                    <tr key={post.postId}>
                        <td>{post.postId}</td>
                        <td>{post.userId}</td>
                        <td>{post.title}</td>
                        <td>{post.createdAt}</td>
                        <td>{post.updatedAt}</td>
                        <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteClick(post)}>삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={loadPosts}
            />
        </div>
    );
}