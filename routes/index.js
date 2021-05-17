var express = require('express');
var router = express.Router();

var usersModel = require('../models/users')

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
router.post('/search', (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let barberShop = req.body.barberShop; // Boolean
  let date = req.body.date

  if(date){
    res.json({ result: true })
  } else {
    res.json({ result: false })
  }
})

module.exports = router;
