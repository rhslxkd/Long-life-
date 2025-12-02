import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import UserForm from "./UserForm";

function Register() {
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (data) => {
        await fetcher('http://localhost:8080/api/users/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        await navigate('/login');
    }

    return (
        <div className="container" style={{maxWidth: 360}}>
            <h2>Long Life;</h2>
            <h3 className="mt-4">회원가입</h3>
            <p className="mb-0">이미 회원이신가요?<a href="/login"> 로그인</a></p>
            <UserForm onSubmit={submitForm} mode="register" />
            {ok && <p>가입완료! 로그인페이지로 이동하세요.</p>}
            {err && <p style={{color: "crimson"}}>{err}</p>}
        </div>
    )
}

export default Register;