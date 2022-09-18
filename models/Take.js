const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Quizz = require("./Quizz");
const TakeAnswer = require("./TakeAnswer");
const User = require("./User");

const Take = sequelize.define(
    "take",
    {
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        timestamps: true,
    }
);

Take.hasMany(TakeAnswer);
TakeAnswer.belongsTo(Take);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = Take;
