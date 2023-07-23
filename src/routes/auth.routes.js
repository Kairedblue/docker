const router = require("express").Router();
const { body, oneOf, check } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../handlers/token.handler");
const { validate } = require("../middlewares/validate");

router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid"),
  body("username")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be 6 characters"),
  validate,
  authController.register
);
router.post(
  "/send-otp",
  body("email").isEmail().withMessage("Email must be valid"),
  validate,
  authController.sendOtp
);
router.post(
  "/login",
  oneOf([
    check("emailOrUsername").isEmail().withMessage("Email must be valid"),
    check("emailOrUsername")
      .isLength({ min: 8 })
      .withMessage("Username must be at least 8 characters"),
  ]),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validate,
  authController.login
);
router.post(
  "/refresh-token",
  body("refreshToken").notEmpty().withMessage("refreshToken is required"),
  validate,
  authController.refreshToken
);
router.post("/verify-access-token", verifyAccessToken, (req, res) => {
  res.status(200).json({ message: "Token verified" });
});
router.delete(
  "/logout",
  body("refreshToken").notEmpty().withMessage("refreshToken is required"),
  validate,
  authController.logout
);
module.exports = router;
