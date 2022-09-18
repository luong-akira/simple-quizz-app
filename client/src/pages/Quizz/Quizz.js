import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./quizz.css";
import NumberCircle from "../../components/NumberCircle/NumberCircle";
import AnswerItem from "../../components/AnswerItem/AnswerItem";
import { LoggedInContext } from "../../context/authorizedUserContext";

const Quizz = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState();
    const [answers, setAnswers] = useState();
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const answerRef = useRef([]);

    const navigate = useNavigate();

    const onQuestion = (i) => {
        setIndex(i);
    };

    let { state } = useLocation();

    let { takeId } = state;
    console.log(takeId);

    const onSubmitAnswers = (e) => {
        console.log("Start");
        answerRef.current.forEach((answer) => answer.submit());
        console.log("End");
        navigate("/");
    };

    useEffect(() => {
        axios.get(`/api/question/${id}`).then((res) => {
            setQuestions(res.data);
            console.log(res.data);
        });

        axios.get(`/api/answer/quizz/${id}`).then((res) => {
            setAnswers(res.data);
            answerRef.current = answerRef.current.slice(0, res.data.length);
        });
    }, []);

    return (
        <div className="container mt-3 Quizz_Wrapper">
            <div className="Quizz_QuestionWrapper">
                {questions && (
                    <div className="Quizz_Question">
                        <div className="d-flex justify-content-center">
                            <img
                                src={
                                    questions[index].img && questions[index].img
                                }
                                className="Quizz_ImageQuestion"
                                alt=""
                            />
                        </div>
                        <p>{questions[index].question}</p>
                    </div>
                )}

                {answers &&
                    answers.map((answer, i) => {
                        if (answer.questionId == questions[index].id) {
                            return (
                                <AnswerItem
                                    answer={answer}
                                    isVisible={true}
                                    takeId={takeId}
                                    ref={(el) => (answerRef.current[i] = el)}
                                />
                            );
                        } else {
                            return (
                                <AnswerItem
                                    answer={answer}
                                    isVisible={false}
                                    takeId={takeId}
                                    ref={(el) => (answerRef.current[i] = el)}
                                />
                            );
                        }
                    })}

                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-primary"
                        disabled={index == 0 ? true : false}
                        onClick={(e) => {
                            if (index > 0) {
                                setIndex(index - 1);
                            } else {
                                setIndex(index);
                            }
                        }}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={
                            questions && index == questions.length - 1
                                ? true
                                : false
                        }
                        onClick={(e) => {
                            if (index < questions.length - 1) {
                                setIndex(index + 1);
                            } else {
                                setIndex(index);
                            }
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="Quizz_QuestionStatus container">
                <div className="row">
                    {questions &&
                        [...Array(questions.length).keys()].map(
                            (question, index) => (
                                <NumberCircle
                                    index={index}
                                    onQuestion={onQuestion}
                                />
                            )
                        )}
                </div>
                <div>
                    <button
                        className="btn btn-danger"
                        onClick={onSubmitAnswers}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quizz;
