const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });
const { IsloggedIn } = require("../middleware/loggedIn");
const {
    getQuestionsFromQuizz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controller/questionController");

router.get("/:quizzId", getQuestionsFromQuizz);
router.post("/:quizzId", upload.single("question_img"), addQuestion);
router.put(
    "/:quizzId/:questionId",
    upload.single("question_img"),
    updateQuestion
);
router.delete("/:quizzId/:questionId", deleteQuestion);

module.exports = router;
