const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Quizz = require("../models/Quizz");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

// @Desc         Get all questions
// @Route        GET /api/question/:quizzId
// @Access       PRIVATE
const getQuestionsFromQuizz = asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
        where: {
            quizzId: req.params.quizzId,
        },
        include: [
            {
                model: Answer,
                attributes: ["id", "answer", "questionId", "quizzId"],
            },
        ],
    });

    if (!questions) {
        return res.status(404).json({ message: "Questions are not found" });
    }
    res.status(200).json(questions);
});

// @Desc         Post question
// @Route        POST /api/question/:quizzId
// @Access       PRIVATE
const addQuestion = asyncHandler(async (req, res) => {
    const { question } = req.body;

    const quizz = await Quizz.findOne({
        where: {
            id: req.params.quizzId,
        },
    });

    if (!quizz) {
        return res.status(404).json({ message: "Quizz are not found" });
    }
    if (!question) {
        return res
            .status(404)
            .json({ message: "Please provide question name" });
    }

    let createdQuestion;

    if (req.file) {
        createdQuestion = await Question.create({
            question,
            img: `/${req.file.destination}${req.file.filename}`,
            quizzId: req.params.quizzId,
        });
    } else {
        createdQuestion = await Question.create({
            question,
            quizzId: req.params.quizzId,
        });
    }

    const allQuestions = await Question.findAll({
        where: {
            quizzId: req.params.quizzId,
        },
    });

    console.log(allQuestions);

    quizz.totalScore = allQuestions.length * 10;
    await quizz.save();

    res.status(201).json(createdQuestion);
});

// @Desc         Update a question
// @Route        PUT /api/question/:quizzId/:questionId
// @Access       PRIVATE
const updateQuestion = asyncHandler(async (req, res) => {
    const { question } = req.body;

    const existQuestion = await Question.findOne({
        where: {
            id: req.params.questionId,
            quizzId: req.params.quizzId,
        },
    });

    if (!existQuestion) {
        return res.status(404).json({ message: "Question is not found" });
    }

    existQuestion.question = question || existQuestion.question;

    if (req.file) {
        if (existQuestion.img == "" || !existQuestion.img) {
        } else {
            fs.unlinkSync(path.join(__dirname, "../", existQuestion.img));
        }
        existQuestion.img = `/${req.file.destination}${req.file.filename}`;
        await existQuestion.save();
    } else {
        await existQuestion.save();
    }

    res.status(201).json(existQuestion);
});

// @Desc         Delete a question
// @Route        DELETE /api/question/:quizzId/:questionId
// @Access       PRIVATE
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findOne({
        where: {
            id: req.params.questionId,
            quizzId: req.params.quizzId,
        },
    });

    if (!question) {
        return res.status(404).json({ message: "Question is not found" });
    }
    if (question.img) {
        fs.unlinkSync(path.join(__dirname, "../", question.img));
    }
    await question.destroy();

    res.status(200).json({ message: "Destroy question successfully" });
});

module.exports = {
    getQuestionsFromQuizz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
};
