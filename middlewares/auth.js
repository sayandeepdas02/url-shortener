const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookie?.uid;

    if(!userUid) return res.redirect("/login");

    // check if the userUid is valid
    const user = getUser(userUid);
    if(!user) return res.redirect("/login");

    // if valid, then allow the request to proceed
    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.cookie?.uid;
    const user = getUser(userUid);
    req.user = user;
    next();
}


module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth
};