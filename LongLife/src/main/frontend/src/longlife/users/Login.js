import {useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import longlifeLogo from "../../assets/images/longlife_logo.png";

function Login() {

    const {
        register,
        handleSubmit,
        formState: {isSubmitting, isSubmitted, errors}
    } = useForm();
    const [err, setErr] = useState("");
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 원래 가려고 했던 주소
    const from = location.state?.from?.pathname || "/";

    const submitForm = async (data) => {
        setErr("");
        setLoading(true);

        try{
            const user = await fetcher('http://localhost:8080/api/users/login' , {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });

            if (user) sessionStorage.setItem("user", JSON.stringify(user));

            navigate(from, {replace:true});
        } catch (e) {
            setErr("네트워크 오류가 발생했습니다.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4" style={{maxWidth: 360}}>
            <form onSubmit={handleSubmit(submitForm)}>
                <img src={longlifeLogo} alt="로고" />
                <h3 className="my-4 fw-normal text-center">로그인</h3>

                <div className="form-floating">
                    <input type="text" className="form-control" id="userId" placeholder="아이디" autoComplete="off"
                           {...register("userId")}/>
                    <label htmlFor="userId">아이디</label>
                </div>
                <div className="form-floating mt-2">
                    <input type="password" className="form-control" id="password" placeholder="비밀번호"
                           {...register("password")}/>
                    <label htmlFor="password">비밀번호</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {err && <p style={{color: "crimson", marginTop: 12}}>{err}</p>}
                <button className="w-100 btn btn-lg btn-primary mt-1" type="button"
                        onClick={() => navigate('/register')}>회원가입
                </button>
            </form>
        </div>
    )
}

export default Login;