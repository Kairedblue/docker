const router = require("express").Router();
const client = require("../configs/redis.config");

router.post("/", (req, res) => {
  //set a string to redis
  client.set("name", "John Doe");
  client.setex("randomData", 3600, "This is a random data");
  res.send("Random data has been set to redis");
});
router.get("/", (req, res) => {
  //get a string from redis
  client.get("name", (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
  client.get("randomData", (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});
module.exports = router;
