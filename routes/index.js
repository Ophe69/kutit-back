var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//signin
router.post('/signin', (re, res) => {
  res.json(true)
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
