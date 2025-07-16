import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import API from "./services/axios";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const getLoggedInUser = async () => {
        try {
            const res = await API.get("/me");
            setUser(res.data.user);
        } catch (err) {
            console.error("Failed to get user", err);
            throw err;
        }
    };

    useEffect( () => {
        getLoggedInUser()
    },[])

    return (
        <GlobalContext.Provider value={{ user, setUser }}>
            {children}
        </GlobalContext.Provider>
    );
};
