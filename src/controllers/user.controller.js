const User = require("../models/user.model");
const { generateToken, verifyToken } = require("../utils/token.utils");
const { hashPassword } = require("../utils/encryption.utils");

exports.getUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const token = generateToken(
      { id: user._id },
      process.env.RESET_PASSWORD_SECRET_KEY,
      "1h"
    );
    res
      .status(200)
      .json({ message: "Reset password link sent to your email", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;
  try {
    const tokenDecoded = verifyToken(
      token,
      process.env.RESET_PASSWORD_SECRET_KEY
    );
    if (!tokenDecoded) return res.status(401).json({ message: "Unauthorized" });
    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ message: "Confirm password does not match the new password" });
    const encryptPassword = await hashPassword(newPassword);
    console.log(tokenDecoded.id);
    const user = await User.findByIdAndUpdate(
      tokenDecoded.id,
      { password: encryptPassword },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
