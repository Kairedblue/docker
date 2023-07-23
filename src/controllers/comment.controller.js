const Comment = require("../models/comment.model");
const mongoose = require("mongoose");
const limit = 5;
exports.createComment = async (req, res) => {
  try {
    const { postId, content, isDel } = req.body;
    if (isDel === true) {
      await Comment.deleteMany({ postId });
    }
    const userId = req.user._id;
    const commentCount = await Comment.countDocuments({ postId });
    const page = Math.max(1, commentCount);
    const filter = { postId, page };
    const update = {
      $inc: { count: 1 },
      $push: {
        comments: {
          commentId: new mongoose.Types.ObjectId(),
          userId,
          content,
        },
      },
    };
    const options = { upsert: true };
    const existingComment = await Comment.findOne({
      postId,
      count: { $lt: limit },
    });
    if (commentCount > 0) {
      if (existingComment) {
        existingComment.comments.push({
          commentId: new mongoose.Types.ObjectId(),
          userId,
          content,
        });
        existingComment.count += 1;
        await existingComment.save();
      } else {
        filter.page += 1;
        await Comment.updateOne(filter, update, options);
      }
    }
    if (commentCount === 0) {
      await Comment.updateOne(filter, update, options);
    }
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getComments = async (req, res) => {
  try {
    const { postId, offset } = req.query;
    const page = offset / limit + 1;
    const comment = await Comment.findOne({ postId, page }).populate(
      "comments.userId",
      "username pciture -_id"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment fetched successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.body;
    const comment = await Comment.findOneAndUpdate(
      {
        postId,
        "comments.commentId": new mongoose.Types.ObjectId(commentId),
        "comments.userId": userId,
      },
      {
        $pull: {
          comments: {
            commentId: new mongoose.Types.ObjectId(commentId),
            userId,
          },
        },
        $inc: { count: -1 },
      },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
