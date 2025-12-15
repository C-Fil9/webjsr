import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/auth/profile').then(({ data }) => {
            setUser(data || null);
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}