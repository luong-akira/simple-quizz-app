const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oidc");
const GitHubStrategy = require("passport-github2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();

passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return cb(null, false);
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return cb(null, false);
            }

            return cb(null, user);
        } catch (error) {}
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
            scope: ["profile"],
        },
        async function verify(issuer, profile, cb) {
            try {
                console.log(profile);
                let user = await User.findOne({
                    where: { username: profile.id },
                });

                if (!user) {
                    const createdUser = await User.create({
                        name: profile.displayName.toString(),
                        username: profile.id.toString(),
                        password: "123456",
                        type: "oauth",
                    });
                    return cb(null, createdUser);
                }

                return cb(null, user);
            } catch (error) {}
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/auth/github/callback",
            scope: ["profile"],
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                let user = await User.findOne({
                    where: { username: profile.username },
                });

                console.log(user);

                if (!user) {
                    const createdUser = await User.create({
                        name: profile.displayName,
                        username: profile.username,
                        password: "123456",
                    });
                    return cb(null, createdUser);
                } else {
                    return cb(null, user);
                }
            } catch (error) {}
        }
    )
);

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: "/api/auth/twitter/callback",
        },
        async function (token, tokenSecret, profile, cb) {
            console.log(profile);
            try {
                let user = await User.findOne({
                    where: { username: profile.username },
                });

                console.log(user);

                if (!user) {
                    const createdUser = await User.create({
                        name: profile.displayName,
                        username: profile.username,
                        password: "123456",
                    });
                    return cb(null, createdUser);
                } else {
                    return cb(null, user);
                }
            } catch (error) {}
        }
    )
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, name: user.name, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

router.get("/login", function (req, res, next) {
    res.json(req.user);
});

// Local
router.post("/login/password", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
});

// Github
router.get("/github/login", passport.authenticate("github"));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        successRedirect: "/",
        failureRedirect: "/signin",
    })
);

// Google
router.get("/google/login", passport.authenticate("google"));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/signin",
    })
);

// Twitter
router.get("/twitter/login", passport.authenticate("twitter"));

router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/signin",
    })
);

router.post("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.json({ message: "Logout successfully" });
    });
});

router.post("/signup", async (req, res) => {
    let salt = await bcrypt.genSalt(10);
    const { name, username, password } = req.body;

    let user = await User.findOne({
        where: {
            username,
        },
    });

    if (user) {
        return res.status(400).json({ message: "User has been existed" });
    }

    let hashPassword = await bcrypt.hash(password, salt);

    User.create({
        name,
        username,
        password: hashPassword,
    })
        .then((user) => res.json(user))
        .catch((err) => {
            if (err) {
                return res.json({ message: err.errors[0].message });
            }
        });
});

module.exports = router;
