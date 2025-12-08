import {NavLink} from "react-router-dom";

export default function SideBar() {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="/admin" className="brand-link">
                <span className="brand-text font-weight-light">Movie Admin</span>
            </a>
            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
                        <li className="nav-item">
                            <NavLink to="/admin"
                                     end
                                     className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>대시보드</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/userList"
                                     className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                <i className="nav-icon fa-solid fa-users"></i>
                                <p>회원관리</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/exerciseList"
                                     className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                <i className="nav-icon fa-solid fa-dumbbell"></i>
                                <p>운종종목관리</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/postList"
                                     className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                <i className="nav-icon fa-regular fa-clipboard"></i>
                                <p>스토리관리</p>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}