const express = require("express");
const route = express.Router();
const {
  createTransaction,
  returnBook,
  getBookTransactionDetail,
  getTransactionByDate,
} = require("../controllers/transaction.controller");

route.post("/issue", createTransaction);
route.put("/return", returnBook);
route.get("/search/:key", getBookTransactionDetail);
route.get("/search", getTransactionByDate);

module.exports = route;
