var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    userName: String,
    mail : String, 
    password : String,
    image: String,
    token: String,
});

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;

