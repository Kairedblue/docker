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

client.set("name", "John Doe");

client.get("name", (err, result) => {
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Name: " + result);
    })
    .listen(3000);
});

module.exports = client;
