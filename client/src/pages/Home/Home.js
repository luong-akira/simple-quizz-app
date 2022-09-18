import React, { useContext, useEffect, useState } from "react";
import QuizzItem from "../../components/QuizzItem/QuizzItem";
import { LanguageContext } from "../../context/languageContext";
import axios from "axios";

const Home = () => {
    const [quizzes, setQuizzes] = useState();
    const [page, setPage] = useState(1);

    useEffect(() => {
        axios
            .get(`/api/quizz?page=${page}`)
            .then((res) => setQuizzes(res.data));
    }, [page]);

    return (
        <div className="container mt-5">
            <div className="row">
                {quizzes &&
                    quizzes.docs &&
                    quizzes.docs.map((quizz) => <QuizzItem quizz={quizz} />)}
            </div>

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
        </div>
    );
};

export default Home;
