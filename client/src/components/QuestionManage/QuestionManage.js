import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Question from "../Question/Question";
import "./questionManage.css";

export const QuestionManage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([Question]);
    const [quizzSelected, setQuizzSelected] = useState();

    const questionRef = useRef([]);

    const addQuestion = () => {
        setQuestions([...questions, Question]);
    };

    const removeQuestion = (index) => {
        let newQuestions = questions.filter((question, i) => i != index);
        setQuestions(newQuestions);
    };

    useEffect(() => {
        axios
            .get("/api/quizz/myQuizzes", { withCredentials: true })
            .then((res) => {
                setQuizzes(res.data);
                if (res.data.length > 0 && res.data[0].id) {
                    setQuizzSelected(res.data[0].id);
                }
            });
    }, []);

    useEffect(() => {
        questionRef.current = questionRef.current.slice(0, questions.length);
    }, [questions]);

    return (
        <div className="mt-3">
            {quizzes && (
                <select
                    name="quizzes"
                    id="quizzes_dropdown"
                    className="form-select"
                    defaultValue={quizzSelected}
                    onChange={(e) => setQuizzSelected(e.target.value)}
                    aria-label="Default select example"
                >
                    {quizzes.map((quizz) => (
                        <option value={quizz.id}>{quizz.name}</option>
                    ))}
                </select>
            )}

            {questions.map((Question, i) => (
                <>
                    {i == 0 ? (
                        <Question
                            addQuestion={addQuestion}
                            quizzId={quizzSelected}
                            hasRemoveButton={false}
                            ref={(el) => (questionRef.current[i] = el)}
                        />
                    ) : (
                        <Question
                            key={i}
                            addQuestion={addQuestion}
                            index={i}
                            removeQuestion={removeQuestion}
                            hasRemoveButton={true}
                            quizzId={quizzSelected}
                            ref={(el) => (questionRef.current[i] = el)}
                        />
                    )}
                </>
            ))}

            <button
                className="btn btn-danger"
                onClick={(e) =>
                    questionRef.current.forEach((question) => question.onSave())
                }
            >
                Save
            </button>
        </div>
    );
};
