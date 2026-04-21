let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

// Pour externaliser la configuration (URI de connexion à la base, 
// port du serveur, etc), et on peut aussi utiliser des variables 
// d'environnement, pour le PORT etc.
require('dotenv').config();

let port = process.env.PORT || 8010;

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://...';
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI manquant. Créez un fichier .env ou définissez la variable d\'environnement.');
  process.exit(1);
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log(`vérifiez with http://localhost:${port}/api/assignments que cela fonctionne`)
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires (URL ENCODED, ce sont des formulaires classiques) et 
// pour les données JSON (Content-Type: application/json)
// si on avait des formulaires avec des fichiers à uploader,
// il vaudrait mieux utiliser le module npm multer à la place de body-parser
// et ça ne change pas énormément le code dans les routes, juste un peu 
// pour récupérer les fichier et les fichiers. Ces formulaires avec fichiers 
// s'appellent des formulaires multipart/form-data, et body-parser ne gère pas
// ce type de formulaire, alors que multer le gère très bien.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// les routes
const prefix = '/api';  // /api/assignments GET POST PUT

app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);


// On démarre le serveur
app.listen(port, () => {
  console.log('Serveur démarré sur le port : ' + port);
});


module.exports = app;


