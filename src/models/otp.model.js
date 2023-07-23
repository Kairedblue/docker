const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 600 },
  },
});
module.exports = model("otp", otpSchema);
