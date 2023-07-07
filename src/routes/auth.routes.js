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
  const data = client.get("name");
  res.send(data);
});

module.exports = router;
