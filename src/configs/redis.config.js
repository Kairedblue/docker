const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => {
  console.log("Error: " + err);
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});
