const express = require("express");
const router = express.Router();
const CommentsCtrl = require("../controllers/comments");
const { likeLimiter } = require("../helpers/rate-limiter");

router.post("/:id/like", likeLimiter, CommentsCtrl.likeComment);

module.exports = router;