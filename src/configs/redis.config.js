const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URI,
});

client.on("error", (err) => {
  console.log("Error: " + err);
});

client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("connect", () => {
  console.log("Redis client connected");
});

module.exports = client;
