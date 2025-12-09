import {createContext, useContext, useState} from "react";
import {fetcher} from "../../lib/fetcher";


const RequestsContext = createContext();

export function RequestsProvider({children}) {
    const [requests, setRequests] = useState([]);

    const refreshRequests = async () => {
        try {
            const data = await fetcher("http://localhost:8080/api/friends/requests");
            setRequests(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <RequestsContext.Provider value={{requests, refreshRequests}}>
            {children}
        </RequestsContext.Provider>
    );
}

export const useRequests = () => useContext(RequestsContext);
