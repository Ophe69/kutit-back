var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    userName: String,
    mail : String, 
    password : String,
    image: String,
    token: String,
    proId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Professionnels'}]
});

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;

