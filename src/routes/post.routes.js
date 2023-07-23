const router = require("express").Router();
const postController = require("../controllers/post.controller");
const { verifyAccessToken } = require("../handlers/token.handler");

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.get("/user-posts/:userId", postController.getUserPosts);
router.get("/user-favorite/:userId", postController.getFavoritePosts);
router.post("/create-post", verifyAccessToken, postController.createPost);
router.post("/favorite-post/:postId", postController.favoritePost);
router.put("/update-post/:postId", postController.updatePost);
router.put("/like-post/:postId", verifyAccessToken, postController.likePost);
router.put(
  "/dislike-post/:postId",
  verifyAccessToken,
  postController.dislikePost
);
router.delete("/delete-post/:postId", postController.deletePost);

module.exports = router;
