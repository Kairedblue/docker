const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const { hashPassword, hashOtp } = require("../utils/encryption.utils");
const { comparePassword } = require("../utils/compare.utils");
const { generateOTP, verifyOTP } = require("../utils/otp.utils");
const { generateToken, verifyToken } = require("../utils/token.utils");
const createError = require("http-errors");
const client = require("../configs/redis.config");
exports.register = async (req, res) => {
  const { username, email, password, picture, otp } = req.body;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userCount = await User.countDocuments({
      $or: [{ email }, { username }],
    });
    if (userCount > 0) {
      return res.status(409).json({
        errors: [
          {
            param: "username",
            message: "Username already exists",
          },
        ],
      });
    }
    const { code, message, errors } = await verifyOTP(email, otp);
    if (code !== 200) return res.status(code).json({ message, errors });
    const encryptPassword = await hashPassword(password);
    await User.create({
      username,
      email,
      password: encryptPassword,
      ...(picture && {
        picture: {
          cover: picture.cover,
          profile: picture.profile,
          key: {
            cover: picture.key.cover,
            profile: picture.key.profile,
          },
        },
      }),
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    //delay for 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userCount = await User.countDocuments({ email });
    if (userCount > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const otp = generateOTP();
    const encryptOTP = await hashOtp(otp);
    await Otp.create({
      email,
      otp: encryptOTP,
    });
    res.status(200).json({ message: "OTP send successfully", otp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");
    if (!user)
      return res.status(404).json({
        errors: [
          {
            param: "emailOrUsername",
            message: "User not found",
          },
        ],
      });
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        errors: [
          {
            param: "password",
            message: "Invalid password",
          },
        ],
      });
    user.password = undefined;
    const accessToken = generateToken(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      "1m"
    );
    const refreshToken = generateToken(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      "1h"
    );
    client.setex(user._id.toString(), 3600, refreshToken);
    res.status(200).json({
      message: "User login successfully",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    client.del(decoded.id.toString());
    res.status(203).json({ message: "User logout successfully" });
  } catch (err) {
    next(err);
  }
};
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const data = await client.get(decoded.id);
    if (refreshToken !== data) throw next(createError.Unauthorized());
    const accessToken = generateToken(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      "1m"
    );
    const newRefreshToken = generateToken(
      { id: decoded.id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      "1h"
    );
    client.setex(decoded.id.toString(), 3600, newRefreshToken);
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};
