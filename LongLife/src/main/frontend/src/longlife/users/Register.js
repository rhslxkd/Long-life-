import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";

function Register() {

    const {
        register,
        handleSubmit,
        formState: {errors}}
        = useForm({mode: 'onChange'});
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
            <form className="text-start mt-4" onSubmit={handleSubmit(submitForm)}>
                <div className="mb-3">
                    <label className="form-label">아이디</label>
                    <input type="text" id="userId" name="userId" className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                           placeholder="4~10자"
                           {...register("userId", {
                               required: "아이디는 필수 입력입니다.",
                               minLength: {value: 4, message: "아이디는 4자 이상 10자 이하로 입력해주세요."},
                               maxLength: {value: 10, message: "아이디는 4자 이상 10자 이하로 입력해주세요."},
                               validate: {
                                   checkId: async (value) => {
                                       if (!value) return true;
                                       const {available} = await fetcher(`http://localhost:8080/api/users/duplicate-check?userId=${encodeURIComponent(value)}`);
                                       return available || '이미 사용중인 아이디입니다.';
                                   }
                               }
                           })}/>
                    {errors.userId && (
                        <span style={{ color: "crimson" }}>{errors.userId.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">비밀번호</label>
                    <input type="password" id="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                           placeholder="8자 이상"
                           {...register("password", {
                               required: "비밀번호는 필수 입력입니다.",
                               minLength: {
                                   value: 8, message: "비밀번호는 8자 이상으로 입력해주세요."
                               }
                           })}/>
                    {errors.password && (
                        <span style={{ color: "crimson" }}>{errors.password.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">이메일</label>
                    <input type="email" id="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                           placeholder="longlife@email.com"
                           {...register("email", {
                               required: "이메일는 필수 입력입니다."
                           })}/>
                    {errors.email && (
                        <span style={{ color: "crimson" }}>{errors.email.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">이름</label>
                    <input type="text" id="name" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                           placeholder="홍길동"
                           {...register("name", {
                               required: "이름은 필수 입력입니다."
                           })}/>
                    {errors.name && (
                        <span style={{ color: "crimson" }}>{errors.name.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">주소</label>
                    <input type="text" id="address" name="address" className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                           placeholder="서울특별시 구로구"
                           {...register("address", {
                               required: "주소는 필수 입력입니다."
                           })}/>
                    {errors.address && (
                        <span style={{ color: "crimson" }}>{errors.address.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">키</label>
                    <input type="text" id="height" name="height" className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                           placeholder="cm"
                           {...register("height", {
                               required: "키는 필수 입력입니다."
                           })}/>
                    {errors.height && (
                        <span style={{ color: "crimson" }}>{errors.height.message}</span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">몸무게</label>
                    <input type="text" id="weight" name="weight" className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                           placeholder="kg"
                           {...register("weight", {
                               required: "몸무게는 필수 입력입니다."
                           })}/>
                    {errors.weight && (
                        <span style={{ color: "crimson" }}>{errors.weight.message}</span>
                    )}
                </div>
                <div>
                    <button type="submit" className="btn btn-primary w-100 mb-0">가입하기</button>
                </div>
                {ok && <p>가입완료! 로그인페이지로 이동하세요.</p>}
                {err && <p style={{color: "crimson"}}>{err}</p>}
            </form>
        </div>
    )
}

export default Register;