function IsloggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized" });
    }
}

module.exports = { IsloggedIn };
