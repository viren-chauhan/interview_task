const User = require("../models/user.model");

const createUser = async (req, res, next) => {
  const { email, username, mobile } = req.body;
  try {
    if (!email || !username || !mobile) {
      throw Error("Enter all the required fields!!!");
    }

    const user = await User.signUp(username, email, mobile);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getAllUsers };
