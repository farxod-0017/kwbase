import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "../styles/login.css"; // <-- shu qo‘shiladi

function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const SECRET_KEY = "my_secret_key_2025";

    const handleLogin = (e) => {
        e.preventDefault();

        if (login === "odinaxon" && password === "0737673") {
            const encrypted = CryptoJS.AES.encrypt("authorized", SECRET_KEY).toString();
            sessionStorage.setItem("auth", encrypted);
            navigate("/categories");
        } else {
            alert("Noto‘g‘ri login yoki parol!");
        }
    };

    return (
        <section className="login">

            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Parol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        Kirish
                    </button>
                </form>
            </div>
        </section>

    );
}

export default LoginPage;
