const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose'); // pour utilier la BDD Mongo DB
const helmet = require("helmet"); // pour éviter les injections et autres failles XSS
const path = require('path');
require('dotenv').config(); // permet de cacher les données d'environnement dans un fichier .env, lui même lister dans un gitignore pour eviter qu'il soit envoyer sur GitHub

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('>> connexion à MongoDB réussie !'))
  .catch(() => console.log('>> connexion à MongoDB échouée...'));

const app = express(); // l'app utilisé étant express, on la redéfinit (= plus pratique à appeler)

app.use((req, res, next) => { // "use" veut dire qu'on répond pour tout type de requete (post, get, put, delete, etc)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet()); // pour utiliser helmet sur toutes les requêtes

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(mongoSanitize({ replaceWith: '_' })) // mongoSanitize remplace les caractères non-autorisés parle caractère _

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // on exporte app, c'est à dire l'application express, pour qu'elle puisse être utilisé dans d'autres fichiers