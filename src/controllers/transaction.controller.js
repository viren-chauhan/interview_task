const Book = require("../models/book.model");
const Transaction = require("../models/transactions.model");
const User = require("../models/user.model");

const createTransaction = async (req, res, next) => {
  const { bookname, username, issuedAt } = req.body;
  try {
    if (!bookname || !username || !issuedAt) {
      throw Error("Enter all the required fields!!!");
    }

    const userExist = await User.find({ username: username });

    if (!userExist.length) {
      throw Error("User not fount!!");
    }

    const bookExist = await Book.find({
      $or: [{ bookname: { $regex: bookname } }],
    });

    if (!bookExist.length) {
      throw Error("Book not fount!!");
    }

    const userId = await userExist[0]._id.toString();
    const rent = await bookExist[0].rent;

    const transactions = await Transaction.create({
      bookname,
      rent,
      username,
      userId,
      issuedAt,
    });

    if (!transactions) {
      return res.status(500).send({ result: "Server internal error!!" });
    }

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const returnBook = async (req, res, next) => {
  const { bookname, username, returnedAt } = req.body;
  try {
    if (!bookname || !username || !returnedAt) {
      throw Error("Enter all the required fields!!!");
    }

    const transactionExist = await Transaction.find({
      username: username,
      bookname: bookname,
    });

    if (!transactionExist.length) {
      return res.status(404).send({ result: "Issued book not found!!" });
    }

    let issuedAt = transactionExist[0].issuedAt;
    let rent = transactionExist[0].rent;
    let totalAmount = countTotalAmount(issuedAt, returnedAt, rent);

    const transactions = await Transaction.findByIdAndUpdate(
      { _id: transactionExist[0]._id },
      {
        $set: {
          returnedAt: new Date(returnedAt),
          status: "Returned",
          amount: totalAmount,
        },
      }
    );

    if (!transactions) {
      return res.status(404).send({ result: "Book not found!!" });
    }

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getBookTransactionDetail = async (req, res) => {
  const { key } = req.params;
  // const { bookname, username, issuedAt, returnedAt } = req.body;

  if (!key) {
    throw Error(
      "At least one of bookname, username, issuedAt and returnedAt is required"
    );
  }

  try {
    const transactionDetail = await Transaction.find({
      $or: [
        { bookname: { $regex: key } },
        { username: { $regex: key } },
        { userId: { $regex: key } },
      ],
    });

    if (!transactionDetail.length) {
      return res.status(404).send({ result: "Book not found!!" });
    }
    let totalAmount = await countTotalRentGenerated(transactionDetail);

    return res.status(200).json({
      transactionDetail,
      total: transactionDetail.length,
      totalAmount,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getTransactionByDate = async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    try {
      const transactions = await Transaction.find();

      if (!transactions.length) {
        return res.status(404).send({ result: "Book not found!!" });
      }

      return res.status(200).send(transactions);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  if (from && to) {
    try {
      const transactions = await Transaction.find({
        issuedAt: {
          $gt: new Date(from),
          $lt: new Date(to),
        },
      });

      if (!transactions.length) {
        return res.status(404).send({ result: "Book not found!!" });
      }

      return res.status(200).send(transactions);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
};

module.exports = {
  createTransaction,
  returnBook,
  getBookTransactionDetail,
  getTransactionByDate,
};

const countTotalAmount = (issuedAt, returnedAt, rent) => {
  let issueTime = issuedAt.getTime();
  let returnTime = new Date(returnedAt).getTime();
  let timeDiff = returnTime - issueTime;
  let dayDiff = timeDiff / (1000 * 3600 * 24);

  let day = Math.ceil(dayDiff);
  let totalAmount = day * rent;
  return totalAmount;
};

const countTotalRentGenerated = async (transactionDetail) => {
  let startRent = 0;

  let totalRent = transactionDetail.map((item) => {
    return (startRent += item.amount);
  });

  let totalAmount = totalRent.reduce((acc, curr) => acc + curr);
  console.log(totalAmount);
  
  return totalAmount;
};

// let a = new Date().getTime();
// console.log("A :",a)
// let b = new Date('2024-09-08T12:34:54.126Z').getTime()
// console.log("B :", b)
// let diffTime = b-a;
// let diffDay = diffTime / (1000 * 3600 * 24);

// let day = Math.ceil(diffDay)
// console.log(day)
