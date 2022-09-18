const express = require("express");
const router = express.Router();
const { IsloggedIn } = require("../middleware/loggedIn");
const { addTakeAnswer } = require("../controller/takeAnswerController");

router.post("/:takeId", IsloggedIn, addTakeAnswer);

module.exports = router;
