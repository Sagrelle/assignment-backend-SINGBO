let Assignment = require("../model/assignment");
let Matiere = require("../model/matiere"); // 🔥 AJOUT

// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res) {
  Assignment.find()
    .populate({
      path: 'matiere',
      populate: {
        path: 'prof'
      }
    })
    .exec((err, assignments) => {
      if (err) {
        res.send(err);
      }
      res.send(assignments);
    });
}

// pagination (inchangé)
function getAssignments(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

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

// GET by id (inchangé)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findById(assignmentId)
    .populate({
      path: 'matiere',
      populate: {
        path: 'prof'
      }
    })
    .exec((err, assignment) => {
      if (err) {
        res.send(err);
      }
      res.json(assignment);
    });
}

// 🔥 POST CORRIGÉ
async function postAssignment(req, res) {

  if (req.body.rendu === true && !req.body.note) {
    return res.status(400).json({
      message: "Impossible de marquer rendu sans note"
    });
  }

  try {
    let assignment = new Assignment();

    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    // 🔥 CONVERSION NOM → OBJECTID
    let matiereId = null;

    if (req.body.matiere) {
      console.log("Matière reçue:", req.body.matiere);

      const matiere = await Matiere.findOne({
        nom: { $regex: `^${req.body.matiere.trim()}$`, $options: "i" }
      });

      console.log("Matière trouvée:", matiere);

      if (!matiere) {
        return res.status(404).json({ message: "Matière non trouvée" });
      }

      matiereId = matiere._id;
    }

    // 🔥 IMPORTANT
    assignment.matiere = matiereId;

    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;

    console.log("POST assignment reçu :", assignment);

    await assignment.save();

    res.json({ message: `${assignment.nom} saved!` });

  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur serveur");
  }
}

// UPDATE (inchangé pour toi)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);

  if (req.body.rendu === true && !req.body.note) {
    return res.status(400).json({
      message: "Impossible de marquer rendu sans note"
    });
  }

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
    },
  );
}

// DELETE (inchangé)
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