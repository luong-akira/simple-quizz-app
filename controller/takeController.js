const { compare } = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const checkAnswer = require("../utils/checkAnswer");
const path = require("path");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Quizz = require("../models/Quizz");
const Take = require("../models/Take");
const TakeAnswer = require("../models/TakeAnswer");
const User = require("../models/User");

// @Desc         Get logged in user takes
// @Route        GET /api/take
// @Access       PRIVATE
const getLoggedInTakes = asyncHandler(async (req, res) => {
    const takes = await Take.findAll({
        where: {
            userId: req.user.id,
        },
        include: [User, Quizz],
    });

    if (!takes) {
        return res.status(404).json({ message: "Take not found" });
    }

    res.status(200).json(takes);
});

// @Desc         Get logged in user take by id
// @Route        GET /api/take/:id
// @Access       PRIVATE
const getLoggedInTakesById = asyncHandler(async (req, res) => {
    const take = await Take.findOne({
        where: {
            userId: req.user.id,
            id: req.params.id,
        },
        include: [User, Quizz],
    });

    if (!take) {
        return res.status(404).json({ message: "Take not found" });
    }

    res.status(200).json(take);
});

// @Desc         Add a take
// @Route        POST /api/take
// @Access       PRIVATE
const addTake = asyncHandler(async (req, res) => {
    const { quizzId } = req.body;

    const take = await Take.create({
        userId: req.user.id,
        quizzId,
    });

    console.log(take);

    res.status(201).json(take);
});

// @Desc         Check answer
// @Route        POST /api/checkAnswers/:takeId
// @Access       PRIVATE
const checkAnswers = asyncHandler(async (req, res) => {
    const { takeId } = req.params;

    let totalScore = await checkAnswer(takeId);

    const take = await Take.findOne({
        where: {
            id: takeId,
        },
    });

    let trueFalseArr = totalScore.map((question) => question.isCorrect == true);
    let trueArr = trueFalseArr.filter((trueFalse) => trueFalse == true);
    console.log(trueFalseArr);
    console.log(trueArr);
    take.score = trueArr.length * 10;
    await take.save();

    res.status(200).json(take);
});

module.exports = {
    getLoggedInTakes,
    getLoggedInTakesById,
    addTake,
    checkAnswers,
};
