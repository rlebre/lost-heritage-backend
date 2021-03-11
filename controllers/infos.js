const Post = require('../models/post');

const { normalizeErrors } = require('../helpers/mongoose');

exports.existingCounties = (req, res) => {
    Post.find({ approved: true }, { "_id": 0, "county": 1 })
        .distinct('county')
        .exec((err, counties) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (!counties) {
                return res.json([]);
            }

            res.json(counties);
        });
}