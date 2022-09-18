const asyncHandler = require("express-async-handler");
const path = require("path");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

// @Desc         Get all answers
// @Route        GET /api/answer/:questionId
// @Access       PRIVATE
const getAllAnswersFromAQuestion = asyncHandler(async (req, res) => {
    const answers = await Answer.findAll({
        where: {
            questionId: req.params.questionId,
        },
    });

    if (!answers) {
        return res.status(404).json({ message: "Answers are not found" });
    }

    res.status(200).json(answers);
});

// @Desc         Get all answers
// @Route        GET /api/answer/quizz/:quizzId
// @Access       PRIVATE
const getAllAnswersFromAQuizz = asyncHandler(async (req, res) => {
    const answers = await Answer.findAll({
        where: {
            quizzId: req.params.quizzId,
        },
    });

    if (!answers) {
        return res.status(404).json({ message: "Answers are not found" });
    }

    res.status(200).json(answers);
});

// @Desc         Create an answer
// @Route        POST /api/answer/:questionId
// @Access       PRIVATE
const addAnswer = asyncHandler(async (req, res) => {
    const { answer, isRightAnswer } = req.body;
    const question = await Question.findOne({
        where: {
            id: req.params.questionId,
        },
    });

    if (!question) {
        return res.status(404).json({ message: "Question is not found" });
    }

    const createdAnswer = await Answer.create({
        answer,
        isRightAnswer: isRightAnswer || false,
        questionId: req.params.questionId,
        quizzId: question.quizzId,
    });

    res.status(201).json(createdAnswer);
});

// @Desc         Update an answer
// @Route        GET /api/answer/:questionId/:answerId
// @Access       PRIVATE
const updateAnswer = asyncHandler(async (req, res) => {
    const { answer, isRightAnswer } = req.body;

    const existAnswer = await Answer.findOne({
        where: {
            id: req.params.answerId,
            questionId: req.params.questionId,
        },
    });

    if (!existAnswer) {
        return res.status(404).json({ message: "Answer is not found" });
    }

    existAnswer.answer = answer || existAnswer.answer;
    existAnswer.isRightAnswer = isRightAnswer || existAnswer.isRightAnswer;

    await existAnswer.save();

    res.status(200).json(existAnswer);
});

// @Desc         Delete an answer
// @Route        GET /api/answer/:questionId/:answerId
// @Access       PRIVATE
const deleteAnswer = asyncHandler(async (req, res) => {
    const existAnswer = await Answer.findOne({
        where: {
            id: req.params.answerId,
            questionId: req.params.questionId,
        },
    });

    if (!existAnswer) {
        return res.status(404).json({ message: "Answer is not found" });
    }

    await existAnswer.destroy();

    res.status(200).json({ message: "Answer destroy successfully" });
});

module.exports = {
    getAllAnswersFromAQuizz,
    getAllAnswersFromAQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer,
};
