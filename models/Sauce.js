const mongoose = require('mongoose'); // sollicite le module de connexion à la BD (mongoose)
const ObjectId = require('mongodb').ObjectID; // (?) > bug de la BD sur la casse, est-ce ok ?

const sauceSchema = mongoose.Schema({ // schema mongoose = reflète les différents champs des formulaires du frontend
  userId: { type: String, required: true }, // identifiant unique MongoDB pour l'utilisateur qui a créé la sauce
  name: { type: String, required: true, unique: true},
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true }, 
});

module.exports = mongoose.model('Sauce', sauceSchema); // on exporte le modèle ainsi créé

// sur les pb de modèle
// number (consignes) à mettre en Number
// [String] (consignes) à remplacer par Array