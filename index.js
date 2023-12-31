const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const createError = require("http-errors");

require("dotenv").config();

const connectDB = require("./src/configs/mongodb.config");
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    creadentials: true,
  })
);
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./src/routes/index"));
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
