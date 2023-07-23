const User = require("../models/user.model");
const { verifyToken } = require("../utils/token.utils");

const tokenDecode = (req, key) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return false;
  const bearer = bearerHeader.split(" ")[1];
  try {
    const tokenDecoded = verifyToken(bearer, key);
    return tokenDecoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") return "TokenExpiredError";
    throw err;
  }
};
exports.verifyAccessToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req, process.env.ACCESS_TOKEN_SECRET_KEY);
  if (tokenDecoded === "TokenExpiredError")
    return res.status(403).json({ message: "Token expired" });
  if (!tokenDecoded) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(tokenDecoded.id).lean().exec();

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  req.user = user;
  next();
};
