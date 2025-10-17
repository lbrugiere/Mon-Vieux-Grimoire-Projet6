const fs = require('fs').promises;
const Book = require('../models/Book');

// Créer un nouveau livre
exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    await book.save()
    res.status(201).json({ message: 'Livre enregistré' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Modifier un livre existant
exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file 
      ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      : { ...req.body };

    delete bookObject._userId;

    const book = await Book.findOne({ _id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId !== req.auth.userId) return res.status(401).json({ message: 'Non autorisé' });

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    res.status(200).json({ message: 'Livre modifié !' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId !== req.auth.userId) return res.status(401).json({ message: 'Non autorisé' });

    const filename = book.imageUrl.split('/images/')[1];
    await fs.unlink(`./images/${filename}`);
    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Livre supprimé !' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupérer un seul livre
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer tous les livres
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};