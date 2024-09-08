const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    bookname: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    issuedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Issued",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transacrion", transactionSchema);
