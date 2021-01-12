const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // pour utilier la BDD Mongo DB
const helmet = require("helmet"); // pour éviter les injections et autres failles XSS
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Ugo:javascript7@cluster0.8u2ds.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // l'app utilisé étant express, on la redéfinit vite fait = plus pratique

app.use((req, res, next) => { // "use" veut dire qu'on répond pour tout type de requete (post, get, put, delete, etc)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet()); // pour utiliser helmet sur toutes les requêtes

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // on exporte app, c'est à dire l'application express, pour qu'elle puisse être utilisé dans d'autres fichiers