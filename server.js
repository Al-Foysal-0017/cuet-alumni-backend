// const express = require("express");
// const morgan = require("morgan");
// const connectDB = require("./config/db");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// // Config dotev
// // require("dotenv").config({
// //   path: "./config/config.env",
// // });
// require("dotenv").config({
//   path: ".env",
// });

// const app = express();
// app.use(cors());

// // Connect to database
// connectDB();

// // body parser
// app.use(bodyParser.json());
// // Load routes
// const authRouter = require("./routes/auth.route");
// const userRouter = require("./routes/user.route");
// const eventRouter = require("./routes/events.route");

// // Dev Logginf Middleware
// app.use(morgan("dev"));

// // Use Routes
// app.use("/api", authRouter);
// app.use("/api", userRouter);
// app.use("/api", eventRouter);

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     msg: "Page not founded",
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });

const express = require("express");
// const home = require("./routes/home.js");

const app = express();

// app.use("/home", home);
app.get("/", function (req, res) {
  res.send("Hello World");
});

// const port = process.env.PORT || 9000;

app.listen(9000, () => console.log(`Successfully run on port 9000`));
