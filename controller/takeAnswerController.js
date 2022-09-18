const asyncHandler = require("express-async-handler");
const path = require("path");
const Answer = require("../models/Answer");
const Take = require("../models/Take");
const TakeAnswer = require("../models/TakeAnswer");

// @Desc         add take answer
// @Route        POST /api/takeAnswer
// @Access       PRIVATE
const addTakeAnswer = asyncHandler(async (req, res) => {
    const { answerId } = req.body;
    const { takeId } = req.params;

    const existAnswer = await TakeAnswer.findAll({
        where: {
            takeId,
            answerId,
        },
    });

    console.log(existAnswer);

    if (existAnswer && existAnswer.length > 0) {
        return res.status(400).json({ message: "answer have been existed" });
    }

    const answer = await Answer.findOne({
        where: {
            id: answerId,
        },
    });

    const take = await Take.findOne({
        where: {
            id: takeId,
        },
    });

    if (!answer) {
        return res.status(404).json({ message: "Answer is not found" });
    }

    if (!take) {
        return res.status(404).json({ message: "Take is not found" });
    }

    const takeAnswer = await TakeAnswer.create({
        answerId: answer.id,
        takeId: take.id,
        questionId: answer.questionId,
    });

    res.status(201).json(takeAnswer);
});

module.exports = { addTakeAnswer };
