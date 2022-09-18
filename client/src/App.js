import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { LanguageContext, data } from "./context/languageContext";
import { LoggedInContext } from "./context/authorizedUserContext";
import axios from "axios";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Quizz from "./pages/Quizz/Quizz";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";

function App() {
    const [language, setLanguage] = useState({ lang: "en", data: data.en });
    const [user, setUser] = useState();

    const toggleLanguage = (lang) => {
        if (lang == "vn") {
            setLanguage({ lang: "vn", data: data.vn });
        } else if (lang == "en") {
            setLanguage({ lang: "en", data: data.en });
        }
    };

    useEffect(() => {
        axios.get("/api/user").then((res) => {
            if (!res.data || res.data == "") {
                console.log("not authorized");
                setUser(null);
            } else {
                console.log("authorized");
                setUser(res.data);
            }
        });

        let lang = localStorage.getItem("lang");
        if (lang) {
            setLanguage({ lang, data: data[lang] });
        }
    }, []);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            <LoggedInContext.Provider value={user}>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<Login />} />
                        <Route path="/admin-panel" element={<AdminPanel />} />
                        <Route path="/quizz/:id" element={<Quizz />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Router>
            </LoggedInContext.Provider>
        </LanguageContext.Provider>
    );
}

export default App;
