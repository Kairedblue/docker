const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validate");

router.get("/", userController.getUsers);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email must be valid"),
  validate,
  userController.forgotPassword
);
router.post(
  "/reset-password",
  body("token").notEmpty().withMessage("Token is required"),
  validate,
  userController.resetPassword
);
module.exports = router;
