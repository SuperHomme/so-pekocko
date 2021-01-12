const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');

const User = require('../models/User');

exports.signup = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email)
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskedEmail,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email)
  User.findOne({ email: maskedEmail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'utilisateur non trouvé' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id,
            token:
              jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};