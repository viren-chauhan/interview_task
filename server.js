require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const connectDB = require("./src/db/index");
const bookRoute = require("./src/router/bookRoutes");
const userRoute = require("./src/router/userRoutes");
const transactionRoute = require("./src/router/transactionRoutes");

// app.get("/", (req, resp) => {
//   console.log({ Result: "Success!" });
//   resp.status(200).json({ Result: "Success!" });
// });
app.use(express.json());
app.use("/api/books", bookRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Is Running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !!!", err.message);
  });
