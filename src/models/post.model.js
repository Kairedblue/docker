const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
    required: true,
  },
  pictureKey: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = model("post", postSchema);
