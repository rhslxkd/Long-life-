import {Link} from "react-router-dom";
import forbiddenImage from "../assets/images/forbidden.png"

function ForbiddenPage() {
    return (
        <div className="container forbiddenPage content vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <img src={forbiddenImage} alt="접근 거부" style={{maxWidth: 250}}/>
                <h1 className="display-1 text-danger fw-bold">403 Forbidden</h1>
                <h2 className="mb-3">접근이 거부되었습니다.</h2>
                <p className="lead mb-4">이 페이지에 접근할 권한이 없습니다. <br/>
                    필요한 권한이 있는지 확인하거나 관리자에게 문의하세요</p>
                <Link to="/">홈으로</Link> <br/>
            </div>
        </div>
    )
}

export default ForbiddenPage;