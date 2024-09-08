const express = require("express");
const route = express.Router();
const {
  getSearchedBooks,
  getAllBooks,
  createBook,
  getSingelBook,
} = require("../controllers/book.controller");

route.get("/search", getSearchedBooks);
route.get("/:key", getSingelBook);
route.get("/", getAllBooks);
route.post("/create", createBook);

module.exports = route;
