const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Take = require("../models/Take");
const Quizz = require("../models/Quizz");

// @Desc         Get logged in user
// @Route        GET /api/user
// @Access       PRIVATE
const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.user.id,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User is not found" });
    }
    res.status(200).json(user);
});

// @Desc         Update logged in user
// @Route        POST /api/user
// @Access       PRIVATE
const updateUser = asyncHandler(async (req, res) => {
    const { name, bio } = req.body;
    const user = await User.findOne({
        where: {
            id: req.user.id,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "Questions are not found" });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    if (req.file) {
        if (user.img) {
            fs.unlinkSync(path.join(__dirname, "../", user.img));
        }

        user.img = `/${req.file.destination}${req.file.filename}`;
        await user.save();
    } else {
        await user.save();
    }

    res.status(200).json(user);
});

// @Desc         Get all users
// @Route        GET /api/user/getAllUsers
// @Access       PRIVATE
const getAllUsers = asyncHandler(async (req, res) => {
    let { page } = req.query;

    if (!page) {
        page = 1;
    }

    // const isAdmin = await User.findOne({
    //     where: {
    //         isAdmin: true,
    //         id: req.user.id,
    //     },
    // });

    // if (!isAdmin) {
    //     return res.status(404).json({ message: "User is not admin" });
    // }

    const userPerPage = 1;

    const totalUsers = await User.count({
        where: {
            isAdmin: false,
        },
    });

    let totalPage = Math.ceil(totalUsers / userPerPage);

    let hasNextPage = true;
    let hasPrevPage = true;

    if (page < totalPage) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    if (page <= 1) {
        hasPrevPage = false;
    } else {
        hasPrevPage = true;
    }

    const users = await User.findAll({
        where: {
            isAdmin: false,
        },
        limit: userPerPage,
        offset: (page - 1) * userPerPage,
    });

    res.status(200).json({
        docs: users,
        page,
        totalPage,
        hasNextPage,
        hasPrevPage,
    });
});

// @Desc         Delete user by id
// @Route        DELETE /api/user/:id
// @Access       PRIVATE
const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User is not found" });
    }

    if (user.img) {
        console.log(path.join(__dirname, "../", user.img));
        fs.unlinkSync(path.join(__dirname, "../", user.img));
    }

    await user.destroy();

    res.status(200).json({ id: user.id });
});

// @Desc         Get took quizzes
// @Route        POST /api/user/history
// @Access       PRIVATE
const getTookQuizzes = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.user.id,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "Questions are not found" });
    }

    const quizzes = await Take.findAll({
        where: {
            userId: req.user.id,
        },
        include: [Quizz],
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json(quizzes);
});

module.exports = {
    getLoggedInUser,
    updateUser,
    getTookQuizzes,
    getAllUsers,
    deleteUserById,
};
