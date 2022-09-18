const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TakeAnswer = sequelize.define(
    "takeanswer",
    {},
    {
        timestamps: true,
    }
);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = TakeAnswer;
