const Take = require("../models/Take");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const TakeAnswer = require("../models/TakeAnswer");

async function checkAnswer(takeId) {
    const take = await Take.findByPk(takeId);

    if (!take) {
        return res.status(404).json({ message: "Take not found" });
    }

    const questions = await Question.findAll({
        where: {
            quizzId: take.quizzId,
        },
        order: [["id", "ASC"]],
    });

    let totalScore = await Promise.all(
        questions.map(async (question, index) => {
            let rightAnswers = await Answer.findAll({
                where: {
                    questionId: question.id,
                    isRightAnswer: true,
                },
            });

            let submitAnswers = await TakeAnswer.findAll({
                where: {
                    takeId,
                    questionId: question.id,
                },
            });

            if (rightAnswers.length == submitAnswers.length) {
                let rightArr = rightAnswers.map(
                    (rightAnswer) => rightAnswer.id
                );
                let subArr = submitAnswers.map(
                    (submitArr) => submitArr.answerId
                );

                let intersection = rightArr.filter((element) =>
                    subArr.includes(element)
                );

                console.log(rightArr, subArr, intersection);

                if (intersection && intersection.length == rightArr.length) {
                    return {
                        questionId: question.id,
                        isCorrect: true,
                    };
                } else {
                    return { questionId: question.id, isCorrect: false };
                }
            } else {
                return { questionId: question.id, isCorrect: false };
            }
        })
    );

    return totalScore;
}

module.exports = checkAnswer;
