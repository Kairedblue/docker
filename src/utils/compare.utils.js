const bcrypt = require("bcrypt");

exports.comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
exports.compareOtp = async (otp, hash) => {
  const result = await bcrypt.compare(otp, hash);
  return result;
};
