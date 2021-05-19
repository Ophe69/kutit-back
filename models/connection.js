const mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};


// décommenter la ligne pour repasser à une connexion à la DB sans passer par les variables d'environnement
//mongoose.connect('mongodb+srv://root:root@cluster0.vkd6f.mongodb.net/kutit?retryWrites=true&w=majority',
mongoose.connect(process.env.MONGODB_URL,
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database connection : Success ***');
    }
   }
);

module.exports = mongoose