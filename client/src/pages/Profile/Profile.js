import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { LoggedInContext } from "../../context/authorizedUserContext";
import "./profile.css";

const Profile = ({ setIsProfileOpen }) => {
    const user = useContext(LoggedInContext);
    const [name, setName] = useState(user.name);
    const [selectedFile, setSelectedFile] = useState();
    const [previewImage, setPreviewImage] = useState();
    const [takes, setTakes] = useState();

    const onProfileSave = () => {
        let formData = new FormData();
        formData.append("name", name);
        formData.append("user_img", selectedFile);

        axios
            .post("/api/user", formData, { withCredentials: true })
            .then((res) => {
                setIsProfileOpen(false);
            });
    };

    useEffect(() => {
        let obj;
        if (selectedFile) {
            obj = URL.createObjectURL(selectedFile);
            setPreviewImage(obj);
        }

        return () => URL.revokeObjectURL(obj);
    }, [selectedFile]);

    useEffect(() => {
        axios
            .get("/api/user/history", { withCredentials: true })
            .then((res) => {
                setTakes(res.data);
                console.log(res.data);
            });
    }, []);

    return (
        <div className="darkBG">
            <div className="centered">
                <div class="Profile_ProfileWrapper">
                    <div className="d-flex justify-content-between">
                        <h4>Profile</h4>
                        <i
                            className="fas fa-times fa-2x"
                            role="button"
                            onClick={() => setIsProfileOpen(false)}
                        ></i>
                    </div>

                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button
                                class="nav-link active"
                                id="home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                            >
                                Profile
                            </button>
                        </li>

                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="contact-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#contact"
                                type="button"
                                role="tab"
                                aria-controls="contact"
                                aria-selected="false"
                            >
                                History
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content Profile_Tab" id="myTabContent">
                        <div
                            className="tab-pane fade show active"
                            id="home"
                            role="tabpanel"
                            aria-labelledby="home-tab"
                        >
                            <div className="d-flex m-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className="form-control"
                                    type="text"
                                    value={user.username}
                                    disabled
                                    readonly
                                />
                            </div>
                            <div className="mb-3 mt-3">
                                <input
                                    className="form-control"
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files[0])
                                    }
                                />
                            </div>
                            <div className="mb-3 mt-3 d-flex justify-content-center">
                                {user.img && !selectedFile && (
                                    <img
                                        className="Profile_ProfilePicture"
                                        src={user.img}
                                    />
                                )}
                                {previewImage && (
                                    <>
                                        <img
                                            className="Profile_ProfilePicture"
                                            src={previewImage}
                                        />
                                        <i
                                            className="fas fa-times"
                                            role="button"
                                            onClick={(e) => {
                                                setSelectedFile(null);
                                                setPreviewImage(null);
                                            }}
                                        ></i>
                                    </>
                                )}
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-danger"
                                    onClick={onProfileSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="contact"
                            role="tabpanel"
                            aria-labelledby="contact-tab"
                        >
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Score/TotalScore</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {takes &&
                                        takes.map((take) => (
                                            <tr>
                                                <th>{take.id}</th>
                                                <td>{`${take.score}/${take.quizz.totalScore}`}</td>
                                                <td>
                                                    {take.createdAt
                                                        .replace(/T/, " ")
                                                        .replace(/\..+/, "")}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
