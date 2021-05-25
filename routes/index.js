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
      res.json({login : true, exist: true, message: 'Vous êtes connecté'})
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
      userSaved = await newUser.save();
      //console.log('user Saved', userSaved);
      res.json({ registered: true, message: 'Compte bien créé!', userSaved}); //, token: userSaved.token
    }
  } res.json({ registered: false, message: 'Cet utilisateur existe déjà!'});
});


/* MAP */
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

module.exports = router;
