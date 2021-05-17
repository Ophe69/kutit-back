var mongoose = require('mongoose');

var ProfessionnelsSchemas = mongoose.Schema({
    id: String,
    nom: String,
    prenom: String,
    latitude: Number,
    longitude : Number,
    mail : String,
    password : String,
    statut: String,
    prestations: [{type: mongoose.Schema.Types.ObjectId, ref: 'prestations'}], // clef étrangère qui le lie à une autre collection
});

const ProfessionnelsModel = mongoose.model('Professionnels', ProfessionnelsSchemas);

module.exports = ProfessionnelsModel;

