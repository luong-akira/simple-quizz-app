const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Answer = require("./Answer");
const Take = require("./Take");
const TakeAnswer = require("./TakeAnswer");

const Question = sequelize.define(
    "question",
    {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
    }
);

Question.hasMany(Answer, { onDelete: "cascade", hooks: true });
Answer.belongsTo(Question);

Question.hasMany(TakeAnswer);
TakeAnswer.belongsTo(Question);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = Question;
