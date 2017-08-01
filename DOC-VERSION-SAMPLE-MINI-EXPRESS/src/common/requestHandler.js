

module.exports = function (req, res, next) {
    req.headers['authorization'] = 'Bearer 00000000';
    next();
};