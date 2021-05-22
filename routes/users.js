var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;


/* var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var request = require('sync-request');
const usersModel = require('../models/users');
// const uid2 = require('uid2');



router.post('/signup', async (req, res) =>{
    const userName = req.body.signupUserName;
    const mail = req.body.signupEmail;
    const password = req.body.signupPassword;

        const newUser = new usersModel({
            userName: userName,
            mail: mail,
            password: password,
            token: uid2(32)
        });

        await newUser.save();
        res.json({ result: true })
}) 


module.exports = router; */
