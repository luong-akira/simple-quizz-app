import axios from "axios";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoggedInContext } from "../../context/authorizedUserContext";
import "./quizzItem.css";

const QuizzItem = ({ quizz }) => {
    const user = useContext(LoggedInContext);
    const navigate = useNavigate();

    const onCreateTake = async (e) => {
        try {
            if (!user) {
                return navigate("/signin");
            }
            console.log(quizz.id);
            let { data } = await axios.post(
                "/api/take",
                { quizzId: quizz.id },
                { withCredentials: true }
            );
            console.log(data);
            navigate(`/quizz/${quizz.id}`, { state: { takeId: data.id } });
        } catch (error) {}
    };

    return (
        <div className="col-6 col-sm-6 col-md-4 col-lg-3">
            <div className="card QuizzItem_QuizzWrapper">
                <img
                    className="card-img-top QuizzItem_QuizzImage"
                    src={quizz.img ? quizz.img : "/no_image.jpg"}
                    alt="Card image cap"
                />
                <div className="card-body">
                    <h4 className="card-title">{quizz.name}</h4>
                    <p className="card-text m-2">
                        Description: {quizz.desc.substring(0, 10)}
                    </p>
                    <p className="card-text m-2">
                        totalScore : {quizz.totalScore}
                    </p>

                    <p className="card-text m-2">
                        type: {quizz.type.toUpperCase()}
                    </p>
                    <button className="btn btn-primary" onClick={onCreateTake}>
                        Start Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizzItem;
