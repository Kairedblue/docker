const router = require("express").Router();
const client = require("../configs/redis.config");

router.post("/", (req, res) => {
  // set a string to Redis
  const { name } = req.body;
  client.set("name", name);
  res.send("Random data has been set to Redis");
});

router.get("/", (req, res) => {
  // get strings from Redis
  client.get("name", (err, nameResult) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(nameResult);
  });
});

module.exports = router;
