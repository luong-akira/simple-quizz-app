import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../../context/authorizedUserContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(LoggedInContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(user);
        // if (!user) {
        //     navigate("/");
        // } else {
        //     if (!user.isAdmin) {
        //         navigate("/");
        //     }
        // }
    }, []);

    return children;
};

export default ProtectedRoute;
