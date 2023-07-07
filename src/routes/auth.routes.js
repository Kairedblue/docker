const router = require("express").Router();
const client = require("../configs/redis.config");

router.post("/", (req, res) => {
  // set a string to Redis
  client.set("name", "John Doe");
  client.setex("randomData", 3600, "This is a random data");
  res.send("Random data has been set to Redis");
});

router.get("/", (req, res) => {
  // get strings from Redis
  client.get("name", (err, nameResult) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    client.get("randomData", (err, randomDataResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      res.send({
        name: nameResult,
        randomData: randomDataResult,
      });
    });
  });
});

module.exports = router;
