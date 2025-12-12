import {useState} from "react";
import {fetcher} from "../../lib/fetcher";
import {useRequests} from "./RequestContext";

export default function Requests() {
    const {requests ,refreshRequests} = useRequests();
    const [err, setErr] = useState(null);
    
    const handleAcceptClick = (friendId) => {
        (async () => {
            try {
                await fetcher(`http://localhost:8080/api/friends/${friendId}/accept`, {
                    method: 'POST'
                });
                await refreshRequests();
            } catch (e) {
                setErr(e.message);
            }
        })();
    }
    
    const handleRejectClick = (friendId) => {
        (async () => {
            try {
                await fetcher(`http://localhost:8080/api/friends/${friendId}`, {
                    method: 'DELETE'
                });
                // await loadRequests();
                await refreshRequests();
            } catch (e) {
                setErr(e.message);
            }
        })();
    }

    return (
        <div className="container" style={{maxWidth: 360}}>
            <h1 className="text-center mt-4">받은 요청</h1>
            <div className="mt-4">
                <ul className="list-group text-center">
                    {requests.length > 0 ? (
                        requests.map(friend => (
                            <li className="list-group-item" key={friend.friendId}>
                                <i className="fa-solid fa-user-group me-2"></i>
                                <span className="me-1">{friend.receiverName}</span><span>({friend.receiverId})</span>
                                <button className="btn btn-success ms-4" onClick={() => handleAcceptClick(friend.friendId)}>수락</button>
                                <button className="btn btn-danger ms-2" onClick={() => handleRejectClick(friend.friendId)}>거절</button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-muted">
                            요청이 없습니다.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}