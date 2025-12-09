import {useCallback, useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import Pagination from "../../components/pagination";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const loadUsers = async (pageNumber = 1) => {
        setLoading(true);
        setErr(null);

        try {
            const data = await fetcher(`http://localhost:8080/api/admin/userList?searchData=${searchValue}&page=${pageNumber-1}`);
            if (!data) return;
            setUsers(data.content);
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
            await loadUsers();
        })();
    }, []);

    if (err) return <div className="text-danger">{err}</div>
    if (!loadUsers) return <div>로딩중...</div>

    // 운동종목 삭제
    const handleDeleteClick = (u) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                (async () => {
                    const result = await fetcher(`http://localhost:8080/api/admin/user/${u.userId}`, {
                        method: "DELETE"
                    });
                    await loadUsers();
                })();
            } catch (e) {
                setErr(e.message);
            }
        }
    }

    const handleSearchClick = () => {
        // alert(`검색클릭, 검색어: ${searchValue}`);
        (async () => {
            await loadUsers();
        })();
    }

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">사용자 목록</h1>
            {/* 검색 필터 */}
            <div className="input-group w-25 ms-auto mb-4">
                <input type="search" className="form-control rounded" placeholder="아이디 검색"
                       aria-label="Search" aria-describedby="search-addon"
                       value={searchValue}
                       onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="button" className="btn btn-outline-primary" onClick={handleSearchClick}>검색</button>
            </div>
            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>사용자ID</th>
                    <th>이메일</th>
                    <th>이름</th>
                    <th>생성일</th>
                    <th>권한</th>
                    <th>비고</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.regdate}</td>
                        <td>{user.role}</td>
                        <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteClick(user)}>삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={loadUsers}
            />
        </div>
    )
}