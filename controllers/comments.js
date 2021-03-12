const Comment = require('../models/post-comment');

const { normalizeErrors } = require('../helpers/mongoose');

exports.likeComment = (req, res) => {
  const commentId = req.params.id;

  if (!commentId) {
    return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide Comment ID' }] });
  }

  Comment.findByIdAndUpdate(commentId, { $inc: { 'likes': 1 } })
    .select('_id comment likes createdAt')
    .exec((err, comment) => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (!comment) {
        return res.status(422).send({ errors: [{ title: 'Invalid Comment ID!', detail: 'Comment does not exist.' }] });
      }

      comment.likes++;
      res.json(comment);
    });
};
