import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userManage.css";

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    const onDeleteUser = (id) => {
        axios.delete(`/api/user/${id}`).then((res) => console.log(res));
    };

    useEffect(() => {
        axios
            .get(`/api/user/getAllUsers?page=${page}`, {
                withCredentials: true,
            })
            .then((res) => {
                setUsers(res.data);
                console.log(res.data);
            });
    }, [page]);

    return (
        <>
            <table class="table table-bordered mt-4 UserManage_Table">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Username</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users &&
                        users.docs &&
                        users.docs.map((user) => (
                            <tr>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <button
                                        className="btn"
                                        onClick={(e) => onDeleteUser(user.id)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {users && (
                <nav aria-label="Page navigation example">
                    <ul className="pagination UserManage_ChangeUserPage">
                        <li
                            className={
                                users.hasPrevPage
                                    ? "page-item"
                                    : "page-item disabled"
                            }
                        >
                            <button
                                className="page-link"
                                disabled={true}
                                aria-label="Previous"
                                onClick={(e) => {
                                    if (users.hasPrevPage) {
                                        setPage(page - 1);
                                    } else {
                                    }
                                }}
                            >
                                <span aria-hidden="true">Prev</span>
                            </button>
                        </li>
                        {Array.from(Array(users.totalPage).keys()).map(
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
                                        onClick={(e) => {
                                            setPage(index + 1);
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            )
                        )}
                        <li
                            className={
                                users.hasNextPage
                                    ? "page-item"
                                    : "page-item disabled"
                            }
                        >
                            <button
                                className="page-link"
                                aria-label="Next"
                                disabled={true}
                                onClick={(e) => {
                                    if (users.hasNextPage) {
                                        setPage(page + 1);
                                    } else {
                                    }
                                }}
                            >
                                <span aria-hidden="true">Next</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
};

export default UserManage;
