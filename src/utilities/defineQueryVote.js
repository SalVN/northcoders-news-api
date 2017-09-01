module.exports = function (req, res, next) {
    const query = req.query;
    if (query.vote === 'up') return 1;
    else if (query.vote === 'down') return -1;
    else return next ({ status: 422, message: 'INVALID QUERY' });
};