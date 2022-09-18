import axios from "axios";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import "./answer.css";

const Answer = forwardRef(
    (
        {
            createAnswerBox,
            index,
            deleteAnswerBox,
            hasRemoveButton,
            questionId,
        },
        ref
    ) => {
        const [answer, setAnswer] = useState();
        const [isCorrect, setIsCorrect] = useState(false);

        const onSubmit = async () => {
            let obj = {
                answer,
                isRightAnswer: isCorrect,
            };
            await axios.post(`/api/answer/${questionId}`, obj, {
                withCredentials: true,
            });
        };

        console.log(questionId);

        useImperativeHandle(ref, () => ({
            onSave: async () => {
                await onSubmit();
            },
        }));
        return (
            <div class="d-flex align-items-center m-2">
                <div class="input-group mb-1 Answer_Input">
                    <div class="input-group-text">
                        <input
                            class="form-check-input mt-0"
                            type="checkbox"
                            onChange={(e) => setIsCorrect(e.target.checked)}
                        />
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        aria-label="Text input with checkbox"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>

                <div className="Answer_Options">
                    <i
                        className="fa fa-plus"
                        onClick={(e) => createAnswerBox()}
                    ></i>

                    {hasRemoveButton && (
                        <i
                            class="fa-solid fa-minus"
                            onClick={(e) => {
                                console.log(index);
                                deleteAnswerBox(index);
                            }}
                        ></i>
                    )}
                </div>
            </div>
        );
    }
);

export default Answer;
