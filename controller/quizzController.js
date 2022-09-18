const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Quizz = require("../models/Quizz");
const User = require("../models/User");

// @Desc         Get all quizzes
// @Route        GET /api/quizz
// @Access       PRIVATE
const getAllQuizzes = asyncHandler(async (req, res) => {
    let { page } = req.query;

    if (!page) {
        page = 1;
    }

    const quizzPerPage = 4;

    const totalQuizzes = await Quizz.count();

    let totalPage = Math.ceil(totalQuizzes / quizzPerPage);

    let hasPrevPage = true;
    let hasNextPage = true;

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

    const quizzes = await Quizz.findAll({
        limit: quizzPerPage,
        offset: (page - 1) * quizzPerPage,
    });

    res.status(200).json({
        docs: quizzes,
        page,
        totalPage,
        hasNextPage,
        hasPrevPage,
    });
});

// @Desc         Get all quizzes
// @Route        GET /api/quizz/myQuizzes
// @Access       PRIVATE
const getLoggedInUserQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quizz.findAll({ where: { userId: req.user.id } });
    res.status(200).json(quizzes);
});

// @Desc         Get quizz by id
// @Route        GET /api/quizz/:id
// @Access       PRIVATE
const getQuizz = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const quizz = await Quizz.findOne({
        where: {
            id,
        },
    });

    if (!quizz) {
        res.status(404).json({ message: "Quizz not found" });
    }

    res.status(200).json(quizz);
});

// @Desc         Add a quizz
// @Route        POST /api/quizz
// @Access       PRIVATE
const addQuizz = asyncHandler(async (req, res) => {
    const { name, desc, type } = req.body;

    if (!name || !desc || !type) {
        return res.status(400).json({ messag: "Please add all the field" });
    }

    const user = await User.findOne({ where: { id: req.user.id } });

    let quizz;

    if (req.file) {
        quizz = await user.createQuizz({
            name,
            desc,
            type,
            img: `/${req.file.destination}${req.file.filename}`,
        });
    } else {
        quizz = await user.createQuizz({
            name,
            desc,
            type,
        });
    }

    res.status(201).json(quizz);
});

// @Desc         Update a quizz
// @Route        PUT /api/quizz/:id
// @Access       PRIVATE
const updateQuizz = asyncHandler(async (req, res) => {
    const { name, desc } = req.body;

    const quizz = await Quizz.findOne({ where: { id: req.params.id } });
    if (!quizz) {
        return res.status(404).json({ message: "Quizz not found" });
    }

    quizz.name = name || quizz.name;
    quizz.desc = desc || quizz.desc;

    if (req.file) {
        fs.unlinkSync(path.join(__dirname, "../", quizz.img));
        quizz.img = `/${req.file.destination}${req.file.filename}`;
        await quizz.save();
    } else {
        await quizz.save();
    }

    res.status(201).json(quizz);
});

// @Desc         Delete a quizz
// @Route        DELETE /api/quizz/:id
// @Access       PRIVATE
const deleteQuizz = asyncHandler(async (req, res) => {
    const quizz = await Quizz.findOne({ where: { id: req.params.id } });

    if (!quizz) {
        return res.status(404).json({ message: "Quizz not found" });
    }

    if (quizz.img) {
        fs.unlinkSync(path.join(__dirname, "../", quizz.img));
    }

    await quizz.destroy();

    res.status(200).json({ message: "Destroy successfully" });
});

module.exports = {
    getAllQuizzes,
    getLoggedInUserQuizzes,
    getQuizz,
    addQuizz,
    updateQuizz,
    deleteQuizz,
};
