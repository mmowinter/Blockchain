const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const EC = require('elliptic').ec;
const TymeCoin = require('./src/tymecoin')


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/src/public/wallet.html'));
  //__dirname : It will resolve to your project folder.
});
router.get('/dashboard',function(req,res){
  res.sendFile(path.join(__dirname+'/src/public/dashboard.html'));
  //__dirname : It will resolve to your project folder.
});
router.get('/img',function(req,res){
  res.sendFile(path.join(__dirname+'/src/public/img/tyme.jpg'));
  //__dirname : It will resolve to your project folder.
});

router.get('/public_key', function(req,res) {
    // Use secp256k1
    const ec = new EC('secp256k1');

    // Generate a new key pair and convert them to hex-strings
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    
    res.send([publicKey, privateKey]);
});

router.get('/unconfirmed_transactions', function(req,res) {
    res.send('OK'); //todo
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
