import {Navigate, Route} from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";

export default function PublicRouter() {
    return (
        <Route element={<UserLayout />} >
            {/*없는데 *을 치거나 /을 치면 home으로 가게끔*/}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
    );
}