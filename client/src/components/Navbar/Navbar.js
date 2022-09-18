import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/languageContext";
import { Link } from "react-router-dom";

import axios from "axios";
import { LoggedInContext } from "../../context/authorizedUserContext";
import Profile from "../../pages/Profile/Profile";

const Navbar = () => {
    const {
        language: { data },
        toggleLanguage,
    } = useContext(LanguageContext);

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const user = useContext(LoggedInContext);
    console.log(user);

    const onLogout = (e) => {
        axios.post("/api/auth/logout").then((res) => {
            console.log("logout");
            window.location.href = "/signin";
        });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Quizz App
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    aria-current="page"
                                    href="/"
                                >
                                    {data.Home}
                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {data.Languages}
                                </a>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                toggleLanguage("en");
                                                localStorage.setItem(
                                                    "lang",
                                                    "en"
                                                );
                                            }}
                                        >
                                            English
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                toggleLanguage("vn");
                                                localStorage.setItem(
                                                    "lang",
                                                    "vn"
                                                );
                                            }}
                                        >
                                            Vietnam
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        {user ? (
                            <ul className="navbar-nav mb-2 mb-lg-0">
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {user.name}
                                    </a>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="navbarDropdown"
                                    >
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={(e) =>
                                                    setIsProfileOpen(true)
                                                }
                                            >
                                                Profile
                                            </a>
                                        </li>
                                        {user.isAdmin && (
                                            <li>
                                                <Link
                                                    to="/admin-panel"
                                                    className="dropdown-item"
                                                >
                                                    Admin Panel
                                                </Link>
                                            </li>
                                        )}

                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={onLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        ) : (
                            <div className="Navbar_LoginRegisterWrapper">
                                <Link to="/signin">
                                    <button className="btn btn-outline-secondary">
                                        {data.Login}
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-outline-secondary">
                                        {data.Register}
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
        </>
    );
};

export default Navbar;
