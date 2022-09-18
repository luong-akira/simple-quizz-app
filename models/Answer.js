const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const TakeAnswer = require("./TakeAnswer");

const Answer = sequelize.define(
    "answer",
    {
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRightAnswer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
    }
);

Answer.hasMany(TakeAnswer);
TakeAnswer.belongsTo(Answer);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = Answer;
