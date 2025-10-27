const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
    }

    res.status(200).json({
      userId: user._id,
      token: jwt.sign(
        { userId: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: '24h' }
      )
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};