const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/user", require("./user.routes"));
router.use("/post", require("./post.routes"));
router.use("/comment", require("./comment.routes"));

module.exports = router;
