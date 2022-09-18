const express = require("express");
const router = express.Router();
const { IsloggedIn } = require("../middleware/loggedIn");
const {
    getAllAnswersFromAQuizz,
    getAllAnswersFromAQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer,
} = require("../controller/answerController");

router.get("/quizz/:quizzId", getAllAnswersFromAQuizz);
router.get("/:questionId", getAllAnswersFromAQuestion);
router.post("/:questionId", addAnswer);
router.put("/:questionId/:answerId", updateAnswer);
router.delete("/:questionId/:answerId", deleteAnswer);

module.exports = router;
