const Sauce = require('../models/Sauce'); // on localise le fichier "model" Sauce
const fs = require('fs');

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(sauce => res.status(201).json({ message: 'sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(sauce => res.status(200).json({ message: 'sauce mise à jour'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(sauce => res.status(200).json({ message: 'sauce supprimée'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeDislikeCancelSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      switch (req.body.like) {
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(201).json({ message: "sauce appréciée" }))
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          break;
        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(201).json({ message: "sauce non appréciée" }))
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          break;
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(201).json({ message: "like annulé" }))
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          } else {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(201).json({ message: "dislike annulé" }))
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};