var mongoose = require('mongoose');

var PrestationSchema = mongoose.Schema({
    type: String, // degrade, bouleAZ, coloration, chignon, etc
    prix: Number // 15, 30
});

var ProfessionnelsSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    mail : String,
    password : String,
    statut: String,
    latitude: Number,
    longitude : Number,
    prestations: [PrestationSchema]
});

const ProfessionnelsModel = mongoose.model('Professionnels', ProfessionnelsSchema);

module.exports = ProfessionnelsModel;

