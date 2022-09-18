import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionManage } from "../../components/QuestionManage/QuestionManage";
import QuizzManage from "../../components/QuizzManage/QuizzManage";
import UserManage from "../../components/UserManage/UserManage";
import { LoggedInContext } from "../../context/authorizedUserContext";
import "./adminPanel.css";

const AdminPanel = () => {
    const user = useContext(LoggedInContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            if (!user.isAdmin) {
                navigate("/");
            }
        }
    }, [user]);

    return (
        <div className="container">
            <ul class="nav nav-tabs" id="myAdmin" role="tablist">
                <li class="nav-item" role="presentation">
                    <button
                        class="nav-link active"
                        id="quizz-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#quizz"
                        type="button"
                        role="tab"
                        aria-controls="quizz"
                        aria-selected="true"
                    >
                        Quizz Manages
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="question-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#question"
                        type="button"
                        role="tab"
                        aria-controls="question"
                        aria-selected="false"
                    >
                        Question Manages
                    </button>
                </li>

                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="user-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#user"
                        type="button"
                        role="tab"
                        aria-controls="user"
                        aria-selected="false"
                    >
                        User Manages
                    </button>
                </li>
            </ul>
            <div class="tab-content" id="myAdminContent">
                <div
                    class="tab-pane fade show active AdminPanel_Tab"
                    id="quizz"
                    role="tabpanel"
                    aria-labelledby="quizz-tab"
                >
                    <QuizzManage />
                </div>
                <div
                    class="tab-pane fade AdminPanel_Tab"
                    id="question"
                    role="tabpanel"
                    aria-labelledby="question-tab"
                >
                    <QuestionManage />
                </div>

                <div
                    class="tab-pane fade AdminPanel_Tab"
                    id="user"
                    role="tabpanel"
                    aria-labelledby="user-tab"
                >
                    <UserManage />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
