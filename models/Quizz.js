const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Answer = require("./Answer");
const Question = require("./Question");
const Take = require("./Take");

const Quizz = sequelize.define(
    "quizz",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        totalScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        type: {
            type: DataTypes.ENUM,
            values: ["easy", "medium", "hard"],
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

Quizz.hasMany(Question, { onDelete: "cascade", hooks: true });
Question.belongsTo(Quizz);

Quizz.hasMany(Answer);
Answer.belongsTo(Quizz);

Quizz.hasMany(Take);
Take.belongsTo(Quizz);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = Quizz;
