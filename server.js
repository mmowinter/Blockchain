const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const EC = require('elliptic').ec;
const {TYMECoin} = require('./src/tymecoin');
const {keyMap} = require('./src/tymecoin')
const {Transaction} = require('./src/transaction');

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/src/public/wallet.html'));
  //__dirname : It will resolve to your project folder.
});
router.get('/masterwallet',function(req,res){
  res.sendFile(path.join(__dirname+'/src/public/masterWallet.html'));
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
    // // Use secp256k1
    const ec = new EC('secp256k1');

    // Generate a new key pair and convert them to hex-strings
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    keyMap[privateKey] = key;
    
    res.send([publicKey, privateKey]);
});

router.get('/unconfirmed_transactions', function(req,res) {
    res.send(TYMECoin.pendingTransactions);
});

router.get('/blocks', function(req,res) {
  res.send(TYMECoin.chain);
});

router.get('/balance', function(req,res) {
  res.send(TYMECoin.getBalanceOfAddress(req.query.add)+'');
});

router.get('/transactionHistory', function(req,res) {
  res.send(TYMECoin.getAllTransactionsForWallet(req.query.add));
});

router.get('/createTransaction', function(req,res) {
  let key = keyMap[req.query.privateKey];
  if (key || req.query.fromAdd) {
    let tx1 = new Transaction(req.query.fromAdd, req.query.toAdd, req.query.amount);
    tx1.signTransaction(key);
    TYMECoin.addTransaction(tx1);
    // todo" broadcast
    res.send(tx1);
  } else {
    res.send('invalid key ' + req.query.privateKey);
  }
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
