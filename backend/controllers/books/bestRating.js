const Book = require('../../models/Book');

module.exports = async (req, res, next) => {
  try {
    const topBooks = await Book.find().sort({ averageRating: -1 }).limit(3);

    res.status(200).json(topBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};