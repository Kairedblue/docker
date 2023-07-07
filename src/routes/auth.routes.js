const router = require("express").Router();
const client = require("../configs/redis.config");

router.post("/", async (req, res) => {
  // set a string to Redis
  const { name } = req.body;
  await client.set("name", name);
  res.send("Random data has been set to Redis");
});

router.get("/", async (req, res) => {
  // get strings from Redis
  const data = await client.get("name");
  res.send(data);
});

module.exports = router;
