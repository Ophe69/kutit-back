var mongoose = require('mongoose');

var usersSchemas = mongoose.Schema({
    id: String,
    userName: String,
    mail : String, 
    password : String,
    token: String,
    /* history: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}], // clef étrangère qui le lie à une autre collection
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'professionnel'}],
    reviews : [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
 */});

const usersModel = mongoose.model('users', usersSchemas);

module.exports = usersModel;

