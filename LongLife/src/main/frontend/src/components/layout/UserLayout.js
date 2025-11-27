import {Outlet, useLocation} from "react-router-dom";
import Header from "../../lib/Header";
import Footer from "../../lib/Footer";

export default function UserLayout() {

    const loc = useLocation();
    const hideHeader = loc.pathname === '/login' || loc.pathname === '/register' || loc.pathname === '/forbidden';
    const hideFooter = loc.pathname === '/login' || loc.pathname === '/register' || loc.pathname === '/forbidden';

    return (
        <>
            {!hideHeader && <Header />}
            <Outlet />
            {!hideFooter && <Footer/>}
        </>
    );
}