const redis = require("redis");
const util = require("util");

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

client.get = util.promisify(client.get).bind(client);
client.set = util.promisify(client.set).bind(client);

module.exports = client;
