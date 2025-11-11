import React from "react";
import { Navigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function ProtectedRoute({ children }) {
    const SECRET_KEY = "my_secret_key_2025";
    const encrypted = sessionStorage.getItem("auth");

    let isAuth = false;

    if (encrypted) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decrypted === "authorized") {
                isAuth = true;
            }
        } catch {
            isAuth = false;
        }
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
