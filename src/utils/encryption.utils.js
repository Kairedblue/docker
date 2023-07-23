const bcrypt = require("bcrypt");
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
exports.hashOtp = async (payload) => {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(payload, salt);
  return hash;
};
