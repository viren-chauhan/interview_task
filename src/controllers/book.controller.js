const Books = require("../models/book.model");

const getSearchedBooks = async (req, res, next) => {
  const { category, bookname, lowestRent, highestRent } = req.body;

  try {
    if (category && bookname && lowestRent && highestRent) {
      try {
        const books = await Books.find({
          $or: [{ bookname: { $regex: bookname } }],
          category,
          rent: { $gt: lowestRent - 0.1, $lt: highestRent + 0.1 },
        });

        if (!books.length) {
          throw Error("Books Not Found");
        }
        return res.status(200).send(books);
      } catch (error) {
        return res.status(404).send({ error: error.message });
      }
    }

    if (category && lowestRent && highestRent) {
      try {
        const books = await Books.find({
          category: category,
          rent: {
            $gt: lowestRent - 0.1,
            $lt: highestRent + 0.1,
          },
        });
        if (!books.length) {
          throw Error("Books Not Found");
        }
        return res.status(200).send(books);
      } catch (error) {
        return res.status(404).send({ error: error.message });
      }
    }

    if (lowestRent && highestRent) {
      try {
        const books = await Books.find({
          rent: { $gt: lowestRent - 0.1, $lt: highestRent + 0.1 },
        });
        if (!books.length) {
          throw Error("Books Not Found");
        }
        return res.status(200).send(books);
      } catch (error) {
        return res.status(404).send({ error: error.message });
      }
    }

    if (bookname) {
      try {
        const books = await Books.find({
          $or: [{ bookname: { $regex: bookname } }],
        });

        if (!books.length) {
          throw Error("Books Not Found");
        }
        return res.status(200).send(books);
      } catch (error) {
        return res.status(404).send({ error: error.message });
      }
    }

    if (category) {
      try {
        const books = await Books.find({
          category: category,
        });

        if (!books.length) {
          throw Error("Books Not Found");
        }
        return res.status(200).send(books);
      } catch (error) {
        return res.status(404).send("Books Not Found!!!");
      }
    }

    throw Error("Books Not Found");
  } catch (error) {
    return res.status(501).send({ error: error.message });
  }
};

const getSingelBook = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (!key) {
      throw Error("Book Id not found!!");
    }

    const book = await Books.findById(key);
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Books.find();
    if (!books) {
      throw Error("Books Not Found");
    }

    return res.status(200).json(books);
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

const createBook = async (req, res, next) => {
  const { bookname, category, rent } = req.body;
  try {
    const books = await Books.create({ bookname, category, rent });
    if (!books) {
      throw Error("Books Not Found");
    }
    console.log(books);

    return res.status(200).json(books);
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

module.exports = {
  getSearchedBooks,
  getSingelBook,
  getAllBooks,
  createBook,
};

//Below APIs functionality is covered by the first function -> getSearchedBooks

// const getSearchedByRentBooks = async (req, res, next) => {
//   const { lowestRent, highestRent } = req.body;
//   try {
//     const books = await Books.find({
//       rent: { $gt: lowestRent, $lt: highestRent },
//     });
//     if (!books) {
//       throw Error("Books Not Found");
//     }
//     return res.status(200).send(books);
//   } catch (error) {
//     res.status(404).send("Books Not Found!!!");
//   }
// };

// const getBooksByName = async (req, res, next) => {
//   const { bookname } = req.body;
//   try {
//     const books = await Books.find({
//       $or: [{ bookname: { $regex: bookname } }],
//     });

//     if (!books) {
//       throw Error("Books Not Found");
//     }
//     return res.status(200).send(books);
//   } catch (error) {
//     return res.status(404).send("Books Not Found!!!");
//   }
// };
