import {useState} from "react";

export default function useMe() {
    const [user, setUser] = useState(() => {
        const uuser = sessionStorage.getItem("user");
        return uuser ? JSON.parse(uuser) : null;
    });

    return user;
}