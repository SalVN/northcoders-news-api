const path = require('path');

const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const { article_id } = req.params;
    let comment = {
        body: req.body.body,
        belongs_to: article_id,
        created_by: req.body.created_by,
        created_at: Date.now()
    };
    comment = new Comments(comment);
    comment.save()
        .then(savedComment => {
            console.log('saved');
            res.status(201).json({ savedComment });
        }).catch(err => {
            next(err);
        });
};