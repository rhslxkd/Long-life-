import NavBar from "./NavBar";
import SideBar from "./SideBar";
import {Outlet} from "react-router-dom";
import Footer from "../../lib/Footer";

export default function AdminLayout () {
    return (
        <div className="wrapper">
            <NavBar />
            <SideBar />

            <div className="content-wrapper">
                <section className="content">
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}