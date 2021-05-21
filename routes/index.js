const { log } = require('debug');
var express = require('express');
var router = express.Router();

//var bcrypt = require('bcrypt');


const ProfessionnelsModel = require('../models/professionnels');
const usersModel = require('../models/users');

//const hash = bcrypt.hashSync(myPlaintextPassword, cost);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* SIGN-IN */
router.post('/signin', async function(req,res,next){

  console.log(req.body);
  var error = []
  var result = false
  let exist = false

  const mail = req.body.signInEmail;
  const password = req.body.signInPassword;

  const user = await usersModel.findOne({ mail: mail, password: password});

  console.log('user log', user)
  
  if(mail == '' || password == ''){
    res.json({ Home: false, error: 'please fill all the fields' });
  }
  if(user){
    exist = true;
    if(password == user.password){
      res.json({ Home: true, token: user.token });
    } else {
      res.json({ Home: false, error: 'wrong password' });
    } 
  } else{
    res.json({ Home: false, error: 'user doesnt exist' });
  }
  res.json({result : true, error})
  
});

/*SIGN-UP*/
router.post('/signup', async function(req,res,next){

  //console.log('req.body:' + req.body);
  var error = []
  var result = false
  var saveUser = null
  
  if(req.body.signupUserName !== ''
  && req.body.signupEmail !== ''
  && req.body.signupPassword !== ''
  ){
  var newUser = new usersModel({
    userName: req.body.signupUserName,
    mail: req.body.signupEmail,
    password: req.body.signupPassword
  })
  //console.log(newUser)
  saveUser = await newUser.save()
  //console.log(saveUser);
  if(saveUser){
    result = true
  }

  }else {
    res.json({ Home: true, saveUser, token: user.token })
  }
  res.json({result : true, saveUser, error})
});

//Map
router.post('/search', async(req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  console.log(latitude, longitude);

  const professionnels = await ProfessionnelsModel.find();

  if( latitude && longitude ) {
    res.json({ result: true, professionnels });
  } else {
    res.json({ result: false, message: 'missing information, please enable geolocation' });
  }
})

module.exports = router;
