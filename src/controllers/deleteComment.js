const path = require('path');
const {Comments} = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const {comment_id} = req.params;
    Comments.findByIdAndRemove(comment_id)
    .then(deletedComment => {
        res.status(200).json({deletedComment});
    }) 
    .catch(err => {
        if (err.name === 'CastError') return next({ status: 404, message: 'COMMENT NOT FOUND'});
        next(err);
    });
};