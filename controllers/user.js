const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');

const User = require('../models/User');
const rot13Cipher = require('../middleware/rot13-cipher');
require('dotenv').config(); // utilisation des variables cachées

exports.signup = (req, res, next) => {
  emailBody = req.body.email.split("@");
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: rot13Cipher(emailBody[0]) + "@" + emailBody[1],
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  emailBody = req.body.email.split("@");
  User
    .findOne({ email: rot13Cipher(emailBody[0]) + "@" + emailBody[1] })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'utilisateur non trouvé' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id,
            token:
              jwt.sign(
              { userId: user._id },
              `${process.env.TOKEN}`,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};