const express = require("express");
const router = express.Router();
const { IsloggedIn } = require("../middleware/loggedIn");
const {
    getLoggedInTakes,
    getLoggedInTakesById,
    addTake,
    checkAnswers,
} = require("../controller/takeController");

router.get("/", IsloggedIn, getLoggedInTakes);
router.post("/checkAnswers/:takeId", checkAnswers);
router.get("/:id", IsloggedIn, getLoggedInTakesById);
router.post("/", IsloggedIn, addTake);

module.exports = router;
