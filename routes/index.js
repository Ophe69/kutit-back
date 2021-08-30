const { log } = require('debug');
var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var bcrypt = require('bcrypt'); 

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
const { PromiseProvider } = require('mongoose');

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
    
    if(bcrypt.compareSync(password, existingUserName.password)){
      passwordOk = true;
      
      res.json({login : true, exist: true, message: 'Vous êtes connecté', token: existingUserName.token, pseudo: existingUserName.userName, image: existingUserName.image })
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
      var hash = bcrypt.hashSync(req.body.password, 10);
      var newUser = new usersModel({
        userName: userName,
        mail: mail,
        password: hash,
        image: image,
        token: uid2(32)
      })
   
      var userSaved = await newUser.save();

      res.json({ registered: true, message: 'Compte bien créé!', token: userSaved.token, pseudo: userSaved.userName, image: userSaved.image}); 
    }
  } else {
    res.json({ registered: false, message: 'Cet utilisateur existe déjà!'});
  } 
});



/* AFFICHE INFO PROFILE*/

router.get ('/profile', async (req,res) =>{
  
  var profileFilled = false
  var message = ('')
  var token = req.query.token
  var userConnected = await usersModel.findOne({ token: token });
  //console.log('req.query', req.query)
  //console.log('un utilisateur trouvé', userConnected);
  
  if(userConnected){
    console.log("userConnected", userConnected)
    res.json({profileFilled: true, userConnected, image: userConnected.image})
  }else{
    res.json({ profileFilled: false, message: 'aucun compte'})
  }
  
  
})

/* EDITER INFOS DU PROFIL */

router.put ('/editProfile', async (req,res) => {

  const token = req.body.token;
  const newPseudo = req.body.newPseudo;
  const newEmail = req.body.newEmail;
  const newPassword = req.body.newPassword;

  const profileUpdated = await usersModel.findOne({ token: token })

  if(profileUpdated){
    profileUpdated.userName = newPseudo;
    profileUpdated.mail = newEmail;
    profileUpdated.password = newPassword;
    profileUpdated.save();
    console.log('nouvelles données user', profileUpdated)
  }
  res.json({profileUpdated})

})


// get Professionel from Homepage
router.post('/search', async(req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  //console.log(latitude, longitude);

  const professionnels = await ProfessionnelsModel.find();

  professionnels.map(p => {
    //console.log('log prestations', p.prestations);
  })

  

  if( latitude && longitude ) {
    //console.log(professionnels)
    res.json({ result: true, professionnels });
  } else {
    res.json({ result: false, message: 'missing information, please enable geolocation' });
  }
});

//Mongoose queries have a populate() function that lets you load a movie and its corresponding director and actors in one line:
//here => loads just the prestations fromm prfessionnel 
//execPopulate() à la place de exec() de
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

  console.log(user);

  if(user){

    const orders = await OrdersModel.find( { userId: user._id } ).populate('proId').exec();
    //pas de populate: map sur une liste 

    console.log(orders);
    res.json({result: true, orders})
  } else {
  res.json({result: false})
  }
  ;
});


module.exports = router;
