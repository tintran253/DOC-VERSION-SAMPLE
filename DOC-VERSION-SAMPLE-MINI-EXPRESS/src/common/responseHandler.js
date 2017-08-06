

module.exports = function (req, res, next) {
    var user = null;
    if (req.user)
        user = req.user;
    else
        user = req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null;

    res.locals.user = user;
    next();
};