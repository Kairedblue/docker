const Otp = require("../models/otp.model");
const { compareOtp } = require("./compare.utils");
exports.generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
exports.verifyOTP = async (email, otp) => {
  const userOTP = await Otp.find({ email });
  if (!userOTP.length) return { code: 404, message: "OTP not found" };
  const lastOTP = userOTP[userOTP.length - 1];
  const isMatch = await compareOtp(otp, lastOTP.otp);
  if (!isMatch)
    return {
      code: 400,
      errors: [{ message: "OTP is incorrect", param: "otp" }],
    };
  return { code: 200, message: "OTP verified successfully" };
};
