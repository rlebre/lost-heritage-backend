const express = require("express");
const router = express.Router();
const PostsCtrl = require("../controllers/posts");
const AuthMiddleware = require("../middlewares/authMiddleware");
const { likeLimiter, createPostLimiter, commentLimiter } = require("../helpers/rate-limiter");

router.post("/createPost", createPostLimiter, PostsCtrl.createPost);
router.get("/filter", PostsCtrl.filterPosts);
router.get("/all", AuthMiddleware.authMiddleware, PostsCtrl.getAllPosts);
router.get("/filtered", PostsCtrl.getFilteredPosts);
router.get("/search", PostsCtrl.searchPosts);
router.get("/approved", AuthMiddleware.authMiddleware, PostsCtrl.getApprovedPosts);
router.get("/pending", AuthMiddleware.authMiddleware, PostsCtrl.getPendingPosts);
router.get("/declined", AuthMiddleware.authMiddleware, PostsCtrl.getDeclinedPosts);
router.get("", PostsCtrl.getPublicPosts);
router.post("/:id/like", likeLimiter, PostsCtrl.likePost);
router.post("/:id/comment", commentLimiter, PostsCtrl.commentPost);
router.post("/:id/approve", AuthMiddleware.authMiddleware, PostsCtrl.approvePost);
router.post("/:id/decline", AuthMiddleware.authMiddleware, PostsCtrl.declinePost);
router.get("/:id", PostsCtrl.getPostDetails);
router.patch("/:id", AuthMiddleware.authMiddleware, PostsCtrl.editPostDetails);

module.exports = router;
