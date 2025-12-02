import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../lib/fetcher";
import UserForm from "./UserForm";
import useMe from "../../hooks/useMe";
import {useForm} from "react-hook-form";

export default function UserEdit() {
    const uuser = useMe();
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!uuser?.userId) return;
        (async () => {
            try {
                const user = await fetcher(`http://localhost:8080/api/users/${uuser.userId}`);
                setUser(user);
            } catch (e) {
                setErr(e.message);
            }
        })();
    }, [uuser]);

    const submitForm = async (data) => {
        try {
            await fetcher(`http://localhost:8080/api/users/${uuser.userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            setOk(true);
            navigate("/myInfo");
        } catch (error) {
            setErr("수정 실패");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 360 }}>
            <h2>Long Life;</h2>
            <h3 className="mt-4">회원정보 수정</h3>
            {user && <UserForm onSubmit={submitForm} defaultValues={user} mode="update" />}
            {ok && <p>수정완료!</p>}
            {err && <p style={{ color: "crimson" }}>{err}</p>}
        </div>
    );
}
