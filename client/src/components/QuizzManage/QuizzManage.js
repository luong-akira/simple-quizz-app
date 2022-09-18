import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./quizzManage.css";

const QuizzManage = () => {
    const getInitialState = () => {
        const value = "easy";
        return value;
    };

    const [quizzes, setQuizzes] = useState([]);
    const [name, setName] = useState();
    const [desc, setDesc] = useState();
    const [type, setType] = useState(getInitialState);
    const [selectedFile, setSelectedFile] = useState();
    const [previewImage, setPreviewImage] = useState();
    const [page, setPage] = useState(1);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!name || name == "") {
            return toast("Please fill name fields");
        }

        if (!desc || desc == "") {
            return toast("Please fill desc fields");
        }

        let form = new FormData();

        form.append("name", name);

        form.append("desc", desc);

        form.append("type", type);

        if (selectedFile) {
            form.append("quizz_img", selectedFile);
        }

        axios
            .post("/api/quizz", form, { withCredentials: true })
            .then((res) => {
                toast("Quizz has been created");
                setName("");
                setDesc("");
                setSelectedFile(null);
                setPreviewImage(null);
            });
    };

    const onDeleteQuizz = (id) => {
        axios.delete(`/api/quizz/${id}`).then((res) => console.log(res));
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
            .get(`/api/quizz?page=${page}`, { withCredentials: true })
            .then((res) => setQuizzes(res.data));
    }, [page]);

    return (
        <>
            <ToastContainer />

            <form onSubmit={onSubmit} className="QuizzManage_Form">
                <div class="form-group mb-3">
                    <label htmlFor="exampleInputEmail1">Name:</label>
                    <input
                        type="text"
                        class="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div class="form-group mb-3">
                    <label htmlFor="exampleInputPassword1">Description:</label>
                    <input
                        type="text"
                        class="form-control"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>

                <div class="form-group mb-3">
                    <label htmlFor="exampleInputPassword1">Type:</label>
                    <select
                        class="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div class="mb-3">
                    <input
                        class="form-control"
                        type="file"
                        id="formFile"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </div>

                {previewImage && (
                    <div className="QuizzManage_PreviewWrapper">
                        <img
                            src={previewImage}
                            alt=""
                            className="QuizzManage_PreviewImage"
                        />
                        <i
                            className="fa fa-times QuizzManage_ClosePreviewImageIcon"
                            onClick={(e) => {
                                setPreviewImage(null);
                                setSelectedFile(null);
                            }}
                        ></i>
                    </div>
                )}

                <button type="submit" class="btn btn-primary">
                    Submit
                </button>
            </form>
            <table class="table table-bordered mt-3">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Desc</th>
                        <th scope="col">Type</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes &&
                        quizzes.docs &&
                        quizzes.docs.map((quizz) => (
                            <tr>
                                <td>{quizz.name}</td>
                                <td>{quizz.desc}</td>
                                <td>{quizz.type.toUpperCase()}</td>
                                <td className="d-flex justify-content-evenly">
                                    <button className="btn">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={(e) => onDeleteQuizz(quizz.id)}
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {quizzes && (
                <nav aria-label="Page navigation example">
                    <ul className="pagination QuizzManage_QuizzPage">
                        <li
                            className={
                                quizzes.hasPrevPage
                                    ? "page-item"
                                    : "page-item disabled"
                            }
                        >
                            <button
                                className="page-link"
                                aria-label="Previous"
                                onClick={(e) => {
                                    if (quizzes.hasPrevPage) {
                                        setPage(page - 1);
                                    }
                                }}
                            >
                                <span aria-hidden="true">Prev</span>
                            </button>
                        </li>
                        {Array.from(Array(quizzes.totalPage).keys()).map(
                            (_, index) => (
                                <li
                                    className={
                                        page == index + 1
                                            ? "page-item active"
                                            : "page-item"
                                    }
                                >
                                    <button
                                        className="page-link"
                                        onClick={(e) => setPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            )
                        )}

                        <li
                            className={
                                quizzes.hasNextPage
                                    ? "page-item"
                                    : "page-item disabled"
                            }
                        >
                            <button
                                className="page-link"
                                aria-label="Next"
                                onClick={(e) => {
                                    if (quizzes.hasNextPage) {
                                        setPage(page + 1);
                                    }
                                }}
                            >
                                <span aria-hidden="true">Next</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
};

export default QuizzManage;
