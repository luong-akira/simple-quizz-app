const express = require("express");
const router = express.Router();
const { IsloggedIn } = require("../middleware/loggedIn");
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
const {
    getLoggedInUser,
    getAllUsers,
    updateUser,
    getTookQuizzes,
    deleteUserById,
} = require("../controller/userController");

router.get("/", IsloggedIn, getLoggedInUser);
router.get("/getAllUsers", IsloggedIn, getAllUsers);
router.get("/history", IsloggedIn, getTookQuizzes);
router.post("/", IsloggedIn, upload.single("user_img"), updateUser);
router.delete("/:id", IsloggedIn, deleteUserById);

module.exports = router;
