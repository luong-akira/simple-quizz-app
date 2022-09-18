import axios from "axios";
import React, { forwardRef, useImperativeHandle, useState } from "react";

const AnswerItem = forwardRef(({ answer, isVisible, takeId }, ref) => {
    const [isChecked, setIsChecked] = useState(false);

    useImperativeHandle(ref, () => ({
        submit() {
            console.log("inside submit");
            if (isChecked) {
                axios
                    .post(
                        `/api/takeAnswer/${takeId}`,
                        { answerId: answer.id },
                        { withCredentials: true }
                    )
                    .then((res) => {
                        axios
                            .post(`/api/take/checkAnswers/${takeId}`)
                            .then((res) => console.log(res));
                    });
            }
        },
    }));

    return (
        <div
            className="Quizz_Answer"
            style={{ display: isVisible ? "" : "none" }}
        >
            <div class="input-group mb-1">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(!isChecked)}
                />
                <p>{answer.answer}</p>
            </div>
        </div>
    );
});

export default AnswerItem;
