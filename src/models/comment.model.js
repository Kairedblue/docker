const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  comments: [
    {
      commentId: {
        type: Schema.Types.ObjectId,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  page: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = model("comment", commentSchema);
