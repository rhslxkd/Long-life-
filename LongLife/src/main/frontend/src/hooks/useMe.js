import {useState} from "react";

function useMe() { //이게 forigner key역할을 함.
    const [user, setUser] = useState(() => {
        const  u = sessionStorage.getItem("user");
        return u ? JSON.parse(u): null;
    });
    return user;
}
export default useMe;
export {useMe};