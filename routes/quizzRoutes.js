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
    getAllQuizzes,
    getLoggedInUserQuizzes,
    getQuizz,
    addQuizz,
    updateQuizz,
    deleteQuizz,
} = require("../controller/quizzController");

router.get("/", getAllQuizzes);
router.get("/myQuizzes", IsloggedIn, getLoggedInUserQuizzes);
router.get("/:id", getQuizz);
router.post("/", upload.single("quizz_img"), IsloggedIn, addQuizz);
router.put("/:id", upload.single("quizz_img"), IsloggedIn, updateQuizz);
router.delete("/:id", IsloggedIn, deleteQuizz);

module.exports = router;
