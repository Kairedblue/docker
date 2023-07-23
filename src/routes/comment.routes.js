const router = require("express").Router();

const commentController = require("../controllers/comment.controller");
const { validate } = require("../middlewares/validate");
const { verifyAccessToken } = require("../handlers/token.handler");
const { body, query } = require("express-validator");

router.post(
  "/create-comment",
  verifyAccessToken,
  body("postId").notEmpty().withMessage("postId is required"),
  body("content").notEmpty().withMessage("content is required"),
  validate,
  commentController.createComment
);
router.get(
  "/",
  query("postId").notEmpty().withMessage("postId is required"),
  validate,
  commentController.getComments
);
router.delete(
  "/delete-comment",
  verifyAccessToken,
  body("postId").notEmpty().withMessage("postId is required"),
  body("commentId").notEmpty().withMessage("commentId is required"),
  commentController.deleteComment
);
module.exports = router;
