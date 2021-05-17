var mongoose = require('mongoose');

var PrestationsSchemas = mongoose.Schema({

    degrade: Number,
    bouleAZ: Number,
    coloration: Number,
    chignon: Number,
    barbe: Number,
    shampoing: Number

});

const PrestationsModel = mongoose.model('prestations', PrestationsSchemas);

module.exports = PrestationsModel;
