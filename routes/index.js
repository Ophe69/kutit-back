//const { log } = require('debug');
var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var uid2 = require('uid2');



const ProfessionnelsModel = require('../models/professionnels');
const usersModel = require('../models/users');

//const hash = bcrypt.hashSync(myPlaintextPassword, cost);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




/* SIGN-IN */

router.post('/signin', async (req,res) =>{

  var userName = req.body.userName
  var password = req.body.password
  var message = ''
  var exist = false
  var login = false
  var passwordOk = false
  var existingUserName = await usersModel.findOne({ userName: userName});
  var existingUserPassword = await usersModel.findOne({ password: password });

  if (userName == '' || password == ''){
    res.json({login : false, message: 'Merci de ne pas laisser de champs vide!'})
  }
  if(!existingUserName){
    exist = false;
    res.json({login : false, exist: false, message: 'Utilisateur introuvable, merci de créer un compte!'})
  } 
  if(existingUserName){
    exist = true;
    //res.json({login : false, exist: true, message: 'on a trouvé un mec'})
    if(password == existingUserName.password){
      passwordOk = true;
      res.json({login : true, exist: true, message: 'Vous êtes connecté', token: existingUserName.token, pseudo: existingUserName.userName})
    }else{
      res.json({login : false, exist: true, passwordOk : true, message: 'Mauvais mot de passe'})
    }
    
  }

});





/*SIGN-UP*/

router.post('/signup', async (req,res) =>{

  var userName = req.body.userName
  var mail = req.body.mail
  var password = req.body.password
  var userSaved = null
  exist = true
  const existingUserEmail = await usersModel.findOne({ mail: mail });
  const existingUserName = await usersModel.findOne({ userName: userName });

  if(!existingUserEmail && !existingUserName){
    var message = ''
    var registered = false
    var exist = false;
    if (userName == '' || mail == '' || password == ''){
      res.json({registered : false, message: 'Merci de ne pas laisser de champs vide'})

    }else {
      var newUser = new usersModel({
        userName: userName,
        mail: mail,
        password: password,
        token: uid2(32)
      })
      //console.log('new user',newUser);
      userSaved = await newUser.save();
      //console.log('user Saved', userSaved);
      res.json({ registered: true, message: 'Compte bien créé!', token: userSaved.token, pseudo: existingUserName.userName}); //, token: userSaved.token
    }
  } res.json({ registered: false, message: 'Cet utilisateur existe déjà!'});
});


//Map
router.post('/search', async(req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  console.log(latitude, longitude);

  const professionnels = await ProfessionnelsModel.find();

  professionnels.map(p => {
    console.log('log prestations', p.prestations);
  })

  

  if( latitude && longitude ) {
    console.log(professionnels)
    res.json({ result: true, professionnels });
  } else {
    res.json({ result: false, message: 'missing information, please enable geolocation' });
  }
});


router.post('/prestations', async(req, res) => {
  const prestations = await ProfessionnelsModel.findById(req.body.professionnel).populate('prestations').exec();
  
  res.render(prestations);
});

//create professional
router.post('/create-pro', async(req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const mail = req.body.mail;
  const password = req.body.password;
  const statut = req.body.statut;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const prestations = req.body.prestations;
  
  console.log(req.body)

  const newPro = new ProfessionnelsModel({
    nom: nom,
    prenom: prenom,
    mail: mail,
    password: password,
    statut: statut,
    latitude: latitude,
    longitude: longitude,
    prestations: prestations
  });
  const proSaved = await newPro.save();

  console.log(proSaved);

  res.json({ result: true })
});

module.exports = router;
