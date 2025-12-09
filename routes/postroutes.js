const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const verifyjwt = require("../middleware/verifyJwt");
const loginLimiter = require("../middleware/loginLimiter");
const post = require("../controllers/post");
// router.use(loginLimiter);
//@ADMIN
router.use(verifyjwt);
router.route("/a/all").get(post.allposts);
router.route("/a/deletepost").delete(post.deletepost_a);

//@USER
router.route("/addpost").post(post.addpost);
router.route("/:id").delete(post.deletepost).patch(post.editpost);
router.route("/:id/like").post(post.likePost);
// @comment
router.route("/addcomment/:id").post(post.addcomment);
router.route("/delete/:postId/:commentId").delete(post.deletecomment);

module.exports = router;
