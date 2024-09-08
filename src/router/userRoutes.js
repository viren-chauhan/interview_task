const express = require("express");
const { createUser, getAllUsers } = require("../controllers/user.controller");
const route = express.Router();

route.post("/signup", createUser);
route.get("/", getAllUsers);

module.exports = route;
