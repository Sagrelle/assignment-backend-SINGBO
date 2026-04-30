let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: String,
    nom: String,
    rendu: Boolean ,


    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere'
    },

    note: {
        type: Number,
        min: 0,
        max: 20
    },

    remarques: String

});

// Pour la pagination, on ajoute le plugin mongoose-aggregate-paginate-v2 
// au schéma Mongoose
AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
