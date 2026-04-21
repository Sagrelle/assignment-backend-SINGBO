let Assignment = require("../model/assignment");

// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res) {
  Assignment.find((err, assignments) => {
    if (err) {
      res.send(err);
    }

    // res sert à renvoyer la réponse au client, ici le navigateur Angular
    // assignment est transformé en JSON et envoyé dans le corps de la
    // réponse HTTP
    res.send(assignments);
  });
}

// fonction pour récupérer les assignments avec pagination
function getAssignments(req, res) {
  let page = parseInt(req.query.page) || 1; // page number, default to 1
  let limit = parseInt(req.query.limit) || 10; // items per page, default to 10

  let options = {
    page: page,
    limit: limit,
  };

  Assignment.aggregatePaginate(Assignment.aggregate(), options)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  // req = la requete HTTP qui contient des infos sur la requete du client
  // c'est envoyé par le navigateur Angular, et on peut y trouver des infos
  // comme les paramètres de l'URL, le corps de la requete, etc
  // req.params = l'id qui est dans l'URL, défini par :id dans la route
  // ca ressemble au route.snapshot.params en Angular
  let assignmentId = req.params.id;

  Assignment.findById(assignmentId, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json(assignment);
  });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  let assignment = new Assignment();

  // req.body contient les données envoyées par le client
  // dans le corps de la requete HTTP
  // dans notre cas, ce sont les données d'un assignment à ajouter,
  // envoyées par le formulaire Angular
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;

  console.log("POST assignment reçu :");
  console.log(assignment);

  // fait l'insertion dans la base de données, et ensuite envoie une
  // réponse au client
  assignment.save((err) => {
    if (err) {
      res.send("cant post assignment ", err);
    }
    res.json({ message: `${assignment.nom} saved!` });
  });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);

  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.json({ message: "updated" });
      }

      // console.log('updated ', assignment)
    },
  );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  try {
    console.log("DELETE recu assignment id : " + req.params.id);
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: `${assignment.nom} deleted` });
    });
  } catch (err) {
    console.log("Error in deleteAssignment: ", err);
    res.status(500).send("Error deleting assignment");
  }
}

module.exports = {
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
