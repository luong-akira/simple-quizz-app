const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const { sequelize } = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

(async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
})();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Session
app.use(
    session({
        name: "user",
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.authenticate("session"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quizz", require("./routes/quizzRoutes"));
app.use("/api/question", require("./routes/questionRoutes"));
app.use("/api/answer", require("./routes/answerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/take", require("./routes/takeRoutes"));
app.use("/api/takeAnswer", require("./routes/takeAnswerRoutes"));

// Serve build folder
if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
