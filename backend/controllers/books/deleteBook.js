const fs = require('fs').promises;
const Book = require('../../models/Book');

module.exports = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    if (book.imageUrl && book.imageUrl.includes('/images/')) {
      const filename = book.imageUrl.split('/images/')[1];
      await fs.unlink(`./images/${filename}`);
    }
    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Livre supprimé !' });
  } catch (error) {
    res.status(500).json({ error });
  }
};