import {Outlet, useLocation} from "react-router-dom";
import Header from "../../lib/Header";
import Footer from "../../lib/Footer";

export default function UserLayout() {

    const loc = useLocation();
    // const hideHeader = ['/login', '/forbidden'].includes(loc.pathname); //헤더를 숨길 경로들 includes 메서드로 확인

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}