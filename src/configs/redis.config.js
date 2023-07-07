const redis = require("redis");
const http = require("http");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
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
client.connect();

module.exports = client;
