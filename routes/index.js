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
