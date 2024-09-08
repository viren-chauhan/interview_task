const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
  },
  { timeseries: true }
);

userSchema.statics.signUp = async function (username, email, mobile) {
  //Validation
  if (!email || !username || !mobile) {
    throw Error("All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Please enter valid email!");
  }

  const exist = await this.findOne({ email, mobile });

  if (exist) {
    throw Error("Email already exists!");
  }

  const user = await this.create({ username, email, mobile });

  return user;
};

module.exports = mongoose.model("Users", userSchema);
