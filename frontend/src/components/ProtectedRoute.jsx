import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    useEffect(() => {
        let isMounted = true; 
        const checkAuth = async () => {
            try {
                await auth();
                if (isMounted) {
                    console.log("Authorization check completed.");
                }
            } catch (error) {
                console.error("Authorization check failed:", error);
                if (isMounted) setIsAuthorized(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false; 
        };
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            console.log("No refresh token found.");
            setIsAuthorized(false);
            return;
        }

        try {
            console.log("Refreshing token...");
            const res = await api.post("http://localhost:8000/api/token/refresh/", { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                console.log("Token refreshed successfully.");
                await auth(); 
            } else {
                console.log("Failed to refresh token.");
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Checking authorization...");

        if (!token) {
            console.log("No access token found.");
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        console.log("Token expiration:", tokenExpiration);
        console.log("Current time:", now);

        if (tokenExpiration < now) {
            console.log("Token expired. Attempting to refresh...");
            await refreshToken();
        } else {
            console.log("Token is valid. Access granted.");
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>{loadingMessage}</div>;
    }

    if (isAuthorized) {
        console.log("Rendering children...");
        return children; 
    } else {
        console.log("Redirecting to login...");
        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;
