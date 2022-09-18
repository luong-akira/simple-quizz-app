const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Quizz = require("./Quizz");
const Take = require("./Take");

const User = sequelize.define(
    "user",
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

        bio: {
            type: DataTypes.STRING,
        },

        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 60],
                    msg: "Your username must have at least 6 character",
                },
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM,
            values: ["username", "oauth"],
            defaultValue: "username",
        },

        img: {
            type: DataTypes.STRING,
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
    }
);

User.hasMany(Quizz);
Quizz.belongsTo(User);

User.hasMany(Take);
Take.belongsTo(User);

(async () => {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

module.exports = User;
