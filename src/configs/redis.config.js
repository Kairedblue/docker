const Redis = require("ioredis");

const client =
  process.env.NODE_ENV === "production"
    ? new Redis(
        `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
      )
    : new Redis({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      });

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
