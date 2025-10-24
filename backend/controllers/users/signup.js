const bcrypt = require('bcrypt');
const User = require('../../models/User');


exports.signup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !'});
  } catch (error) {
    res.status(500).json({ error });
  }
};