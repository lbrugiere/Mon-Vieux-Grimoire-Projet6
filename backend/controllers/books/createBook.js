const Book = require('../../models/Book');

module.exports = async (req, res, next) => {
  try {
    const bookObject = req.file
      ? JSON.parse(req.body.book)
      : { ...req.body };
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: req.file
        ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        : bookObject.imageUrl,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};