import axios from "axios";
import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
    useRef,
} from "react";
import Answer from "../Answer/Answer";
import "./question.css";

const Question = forwardRef(
    ({ addQuestion, index, removeQuestion, hasRemoveButton, quizzId }, ref) => {
        const [answers, setAnswers] = useState([Answer]);
        const [selectedFile, setSelectedFile] = useState();
        const [previewImage, setPreviewImage] = useState();
        const [question, setQuestion] = useState();
        const [questionId, setQuestionId] = useState();

        const answerRef = useRef([]);

        const createAnswerBox = () => {
            setAnswers([...answers, Answer]);
        };

        const deleteAnswerBox = (index) => {
            const newAnswers = answers.filter((answer, i) => i != index);
            setAnswers(newAnswers);
        };

        const onSubmit = async (e) => {
            let form = new FormData();
            if (!question || question == "") {
                return;
            }

            form.append("question", question);
            if (selectedFile) {
                form.append("question_img", selectedFile);
            }

            let { data } = await axios.post(`/api/question/${quizzId}`, form, {
                withCredentials: true,
            });

            setQuestionId(data.id);
        };

        useImperativeHandle(ref, () => ({
            onSave: async () => {
                await onSubmit();
            },
        }));

        useEffect(() => {
            let obj;
            if (selectedFile) {
                obj = URL.createObjectURL(selectedFile);
                setPreviewImage(obj);
            }

            return () => URL.revokeObjectURL(obj);
        }, [selectedFile]);

        useEffect(() => {
            answerRef.current = answerRef.current.slice(0, answers.length);
        }, [answers]);

        useEffect(() => {
            if (questionId) {
                answerRef.current.forEach((answer) => answer.onSave());
            }
        }, [questionId]);

        return (
            <>
                <form action="" className="mt-3 Question_Form">
                    <div className="Question_QuestionInput d-flex align-items-center">
                        <input
                            class="form-control Question_Question"
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />

                        <input
                            type="file"
                            id={`Question_FileInput${index}`}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="Question_FileInput"
                        />
                        <div className="Question_ImageWrapper d-flex">
                            <img
                                src="/image.png"
                                className="Question_ImageIcon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById(
                                            `Question_FileInput${index}`
                                        )
                                        .click();
                                }}
                                alt=""
                            />
                            {selectedFile ? (
                                <p
                                    data-bs-toggle="modal"
                                    data-bs-target={`#exampleModal${index}`}
                                >
                                    {selectedFile.name.substring(0, 8)}
                                </p>
                            ) : (
                                <p>0 file selected</p>
                            )}
                        </div>
                        <div className="Question_EditButton">
                            <i
                                class="fa-solid fa-plus"
                                onClick={(e) => addQuestion()}
                            ></i>
                            {hasRemoveButton && (
                                <i
                                    class="fa-solid fa-minus"
                                    onClick={(e) => removeQuestion(index)}
                                ></i>
                            )}
                        </div>
                    </div>

                    {answers.map((Answer, i) => (
                        <>
                            {i == 0 ? (
                                <Answer
                                    createAnswerBox={createAnswerBox}
                                    hasRemoveButton={false}
                                    questionId={questionId}
                                    ref={(el) => (answerRef.current[i] = el)}
                                />
                            ) : (
                                <Answer
                                    createAnswerBox={createAnswerBox}
                                    index={i}
                                    deleteAnswerBox={deleteAnswerBox}
                                    hasRemoveButton={true}
                                    questionId={questionId}
                                    ref={(el) => (answerRef.current[i] = el)}
                                />
                            )}
                        </>
                    ))}
                </form>
                <div
                    className="modal fade"
                    id={`exampleModal${index}`}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-content">
                                <img
                                    className="Question_PrewViewImage"
                                    src={previewImage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

export default Question;
