import {useCallback, useEffect, useState} from "react";
import {fetcher} from "../../lib/fetcher";

export default function Friends() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const loadFriends = async () => {
        setLoading(true);
        setErr(null);

        try {
            const data = await fetcher('http://localhost:8080/api/friends');
            if (!data) return;
            setFriends(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadFriends();
        })();
    }, []);

    if (err) return <div className="text-danger">{err}</div>
    if (!loadFriends) return <div>로딩중...</div>

    const handleDeleteClick = (f) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                (async () => {
                    const result = await fetcher(`http://localhost:8080/api/friends/${f.friendId}`, {
                        method: "DELETE"
                    });
                    await loadFriends();
                })();
            } catch (e) {
                setErr(e.message);
            }
        }
    }

    return (
        <div className="container" style={{maxWidth: 360}}>
            <h1 className="text-center mt-4">친구 목록</h1>
            <div className="mt-4">
                <ul className="list-group text-center">
                    {friends.length > 0 ? (
                        friends.map(friend => (
                            <li className="list-group-item" key={friend.friendId}>
                                <i className="fa-solid fa-user-group me-2"></i>
                                <span className="me-1">{friend.receiverName}</span><span>({friend.receiverId})</span>
                                <button className="btn btn-danger ms-4" onClick={() => handleDeleteClick(friend)}>삭제</button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-muted">
                            등록된 친구가 없습니다
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}