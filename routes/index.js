const { log } = require('debug');
var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var uid2 = require('uid2');

/*var uniqid = require('uniqid');
 var fs = require('fs');
const request = require('sync-request');

var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET_KEY,
}); */

const ProfessionnelsModel = require('../models/professionnels');
const usersModel = require('../models/users');
const OrdersModel = require('../models/orders');

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

  console.log(req.body);

  var userName = req.body.userName
  var mail = req.body.mail
  var password = req.body.password
  var image = req.body.image
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
        image: image,
        token: uid2(32)
      })
      //console.log('new user',newUser);
      var userSaved = await newUser.save();
      //console.log('user Saved', userSaved);
      res.json({ registered: true, message: 'Compte bien créé!', token: userSaved.token, pseudo: userSaved.userName}); //, token: userSaved.token
    }
  } else {
    res.json({ registered: false, message: 'Cet utilisateur existe déjà!'});
  } 
});


// get Professionel from Homepage
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
  const imageNumber = req.body.imageNumber;
  const stars = req.body.stars;
  const votedBy = req.body.votedBy;
  
  console.log(req.body)

  const newPro = new ProfessionnelsModel({
    nom: nom,
    prenom: prenom,
    mail: mail,
    password: password,
    statut: statut,
    latitude: latitude,
    longitude: longitude,
    prestations: prestations,
    imageNumber: imageNumber,
    stars: stars,
    votedBy: votedBy
  });
  const proSaved = await newPro.save();

  console.log(proSaved);

  res.json({ result: true })
});


/* CLOUDINARY */

/* router.post('/upload', async function(req, res, next) {

  var imagePath = './tmp/'+uniqid()+'.jpg';
  var resultCloudinary = await cloudinary.uploader.upload(imagePath);
  //var resultCopy = await req.files.avatar.mv(pictureName);
  if(!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(pictureName);


  res.json(resultCloudinary, //url: resultCloudinary.url);
  }else{
    res.json({error: resultcopy})
  }
   fs.unlinkSync(imagePath// pictureName);
}); */


// add order
router.post('/add-order', async(req, res) => {

  const user = await usersModel.findOne({token: req.body.token});
  const pro = await ProfessionnelsModel.findOne({_id: req.body.proFrontId})

  if(user && pro){

    const newOrder = new OrdersModel({
      type: req.body.type,
      prix: req.body.prix,
      date: req.body.date,
      userId: user._id,
      proId: pro._id
    });

    const order = await newOrder.save();

    if(order){
      res.json({message: 'order saved', order});
    } else {
      res.json({message: 'failed to save order'})
    }

  } else {
    res.json({message: 'failed to save order, user token or pro not found'});
  }
  
  
})


//orders history
router.get('/orders', async (req, res) => {

  const user = await usersModel.findOne({token: req.query.token});

  // console.log(user);

  if(user){

    const orders = await OrdersModel.find( { userId: user._id } ).populate('proId').exec();

    // console.log(orders);
    res.json({result: true, orders})
  } else {
  res.json({result: false})
  }
  ;
});


module.exports = router;
