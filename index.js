// const express = require("express");
// const http = require("http");
// const morgan = require("morgan");
// const cors = require("cors");
// const helmet = require("helmet");
// const path = require("path");
// const createError = require("http-errors");

// require("dotenv").config();

// const connectDB = require("./src/configs/mongodb.config");
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 5000;

// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());
// app.use(helmet());
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/api", require("./src/routes/auth.routes"));
// app.use((req, res, next) => {
//   next(createError.NotFound("This route does not exist"));
// });
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.send({
//     status: err.status || 500,
//     message: err.message,
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
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

client.get("name", (err, nameResult) => {
  if (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(`<h1>Hello ${nameResult}</h1>`);
      res.end();
    })
    .listen(3000, () => {
      console.log("Server is running on port 3000");
    });
});
