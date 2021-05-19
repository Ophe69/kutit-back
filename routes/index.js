var express = require('express');
var router = express.Router();

const ProfessionnelsModel = require('../models/professionnels');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* 
//SIGN-IN
router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password){
    res.json({result: false})
  } else {
    res.json({ result: true, user: { pseudo: 'pim', firstName: 'Pierre',lastName: 'ferrand', email: 'pierre@gmail.com'} })
  }
  })
  

//SIGNUP
router.post('/sign-up', async function(req,res,next){

  var error = [] //erreur dans un tableau n'est pas la meilleure solution 
  var result = false
  var saveUser = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
    }
  }
  

  res.json({result, saveUser, error})
}) */

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
