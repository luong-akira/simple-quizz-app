import React, { useState, useContext, useEffect } from "react";
import { LanguageContext } from "../../context/languageContext";
import { LoggedInContext } from "../../context/authorizedUserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
    const {
        language: { data },
    } = useContext(LanguageContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const onLogin = (e) => {
        e.preventDefault();
        axios
            .post("/api/auth/login/password", { username, password })
            .then((res) => {
                window.location.href = "/";
            });
    };

    return (
        <div className="container Login_Wrapper">
            <h1 className="Login_Heading">{data.Login}</h1>
            <form onSubmit={onLogin} className="Login_Form">
                <div className="mb-3 row">
                    <label
                        htmlFor="inputEmail"
                        className="form-label Login_Label"
                    >
                        {data.Username}
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        id="inputEmail"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3 row">
                    <label
                        htmlFor="inputPassword"
                        className="form-label Login_Label"
                    >
                        {data.Password}
                    </label>

                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3 row">
                    <button
                        type="submit"
                        className="btn btn-primary Login_LoginBtn"
                    >
                        {data.Login}
                    </button>
                </div>
                <hr />
            </form>
            <div className="mb-3 row">
                <a
                    className="btn Login_LoginWithGoogleBtn"
                    href="http://localhost:5000/api/auth/google/login"
                >
                    <img src="/google.png" className="Login_GoogleIcon" />{" "}
                    {data.Login_with_google}
                </a>
            </div>

            <div className="mb-3">
                <p>
                    {data.Dont_have_an_account} ?{" "}
                    <a href="/register">{data.Register}</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
