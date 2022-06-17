const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
// Config dotev
require("dotenv").config({
  path: "./config/config.env",
});

const app = express();
app.use(cors());

// Connect to database
connectDB();

// body parser
app.use(bodyParser.json());
// Load routes
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");

// Dev Logginf Middleware
app.use(morgan("dev"));

// Use Routes
app.use("/api", authRouter);
app.use("/api", userRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Page not founded",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// var cors = require("cors");
// app.use(cors());
// app.get("/api/", function (req, res) {
//   res.json({ msg: "Naiem Al Foysal" });
// });
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Your app running successfully on port:${PORT}`);
// });
