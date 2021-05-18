var express = require('express');
var router = express.Router();

const ProfessionnelsModel = require('../models/professionnels');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//SIGN-IN
router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })

    if(user){
      result = true
    } else {
      error.push('email ou mot de passe incorrect')
    }
  }

  res.json({result, user, error})

})

//signup
router.post('/signup', (re, res) => {
  res.json(true)
})

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
