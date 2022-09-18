import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../context/languageContext";

const Register = () => {
    const {
        language: { data },
    } = useContext(LanguageContext);

    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();

    const navigate = useNavigate();

    const onRegister = (e) => {
        e.preventDefault();

        if (!name || name == "") {
            return toast("Please fill in the name field");
        }

        if (!username || username == "") {
            return toast("Please fill in the username field");
        }

        if (password != password2) {
            return toast("Password does not match");
        }

        axios
            .post("/api/auth/signup", { name, username, password })
            .then((res) => navigate("/signin"));
    };

    return (
        <>
            <ToastContainer />

            <div className="container Register_Wrapper">
                <h1 className="Register_Heading">Register</h1>
                <form onSubmit={onRegister}>
                    <div className="mb-3 row">
                        <label
                            htmlFor="inputName"
                            className="form-label Register_Label"
                        >
                            {data.Name}
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="inputName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 row">
                        <label
                            htmlFor="inputEmail"
                            className="form-label Register_Label"
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
                            className="form-label Register_Label"
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
                        <label
                            htmlFor="inputPassword2"
                            className="form-label Register_Label"
                        >
                            {data.Confirm_Password}
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            id="inputPassword2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 mt-4 row">
                        <button
                            type="submit"
                            className="btn btn-primary Register_RegisterBtn"
                        >
                            {data.Register}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
