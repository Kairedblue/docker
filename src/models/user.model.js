const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  picture: {
    cover: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default: "",
    },
    key: {
      cover: {
        type: String,
        default: "",
      },
      profile: {
        type: String,
        default: "",
      },
    },
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  tick: {
    type: Boolean,
    default: false,
  },
});
module.exports = model("user", userSchema);
