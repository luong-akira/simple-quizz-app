import React from "react";
import "./numberCircle.css";

const NumberCircle = ({ index, onQuestion }) => {
    return (
        <div
            className="col-md-4 col-lg-2 numberCircle"
            onClick={(e) => onQuestion(index)}
        >
            {index + 1}
        </div>
    );
};

export default NumberCircle;
