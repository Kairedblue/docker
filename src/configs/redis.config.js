const Redis = require("ioredis");

const client = new Redis(
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);

client.on("connect", () => {
  console.log("Connected to Redis");
});
client.on("error", (err) => {
  console.log(err);
});
client.on("ready", () => {
  console.log("Redis is ready");
});

module.exports = client;
