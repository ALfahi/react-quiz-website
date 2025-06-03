// This script is used to keep track of when user is logged in or not using a centeralised react context, this can make 
// keep track of login sessions much easier.
//
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // if token is not null then it mans that user is logged in.
    // token stores: id, username, email and role.
    const [token, setToken] = useState(localStorage.getItem("user token"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);// this way we can do e.g. user.admin == ... etc etc.
            } catch (error) {
                console.error("Invalid token", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    // used to login the user
    const login = (newToken) => {
        localStorage.setItem("user token", newToken);
        setToken(newToken);
    };
    // used to logout the user.
    const logout = () => {
        localStorage.removeItem("user token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}{/* only let the specific pages rerender when one of these values changes, to stop whole app from rerendering */};
        </AuthContext.Provider>
    );
}

// Hook to use auth in any component
export function useAuth() {
    return useContext(AuthContext);
}
