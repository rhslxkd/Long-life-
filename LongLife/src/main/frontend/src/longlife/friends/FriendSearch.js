import {useEffect, useMemo, useState} from "react";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";

export default function FriendSearch() {
    const uuser = useMe();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    const loadUserList = async () => {
        setLoading(true);
        setErr(null);

        try {
            const data = await fetcher(`http://localhost:8080/api/friends/search?value=${searchValue}`);
            if (!data) return;
            setUsers(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

    }, []);

    if (err) return <div className="text-danger">{err}</div>
    if (!loadUserList) return <div>로딩중...</div>
    
    const handleSearchClick = () => {
        // alert(`검색클릭, 검색어: ${searchValue}`);
        (async () => {
            await loadUserList();
        })();
    }

    const handleAddFriendClick = (user) => {
        const dto = {
            requesterId: uuser.userId,
            receiverId: user.userId
        }
        try {
            (async () => {
                const data = await fetcher('http://localhost:8080/api/friends/request', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dto)
                });
                await loadUserList();
            })();
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container" style={{maxWidth: 360}}>
            <h1 className="text-center mt-4">친구 요청</h1>
            <div className="mt-4">
                <div className="input-group">
                    <input type="search" className="form-control rounded" placeholder="아이디 검색"
                           aria-label="Search" aria-describedby="search-addon"
                           value={searchValue}
                           onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-primary" onClick={handleSearchClick}>검색</button>
                </div>
                <ul className="list-group text-center mt-4">
                    {users.map(user => (
                        <li className="list-group-item" key={user.userId}>
                            <i className="fa-solid fa-user-group me-2"></i>
                            <span className="me-1">{user.name}</span><span>({user.userId})</span>
                            <button className="btn btn-success ms-4" onClick={() => handleAddFriendClick(user)}>친구신청
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}