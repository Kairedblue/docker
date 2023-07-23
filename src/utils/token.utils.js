const jwt = require("jsonwebtoken");
exports.generateToken = (payload, secret, time) => {
  const token = jwt.sign(payload, secret, { expiresIn: time });
  return token;
};
exports.verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret, (err, decoded) => {
    if (err) throw err;
    return decoded;
  });
  return decoded;
};
