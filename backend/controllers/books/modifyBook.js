const Book = require('../../models/Book');

module.exports = async (req, res, next) => {
  try {
    const bookObject = req.file 
      ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
      : { ...req.body };

    delete bookObject._userId;

    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id },
    );
    res.status(200).json({ message: 'Livre modifié !' });
  } catch (error) {
    res.status(500).json({ error });
  }
};