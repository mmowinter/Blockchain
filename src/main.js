const {Blockchain} = require('./blockchain');
const {Transaction} = require('./transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('9cf0026688cdae5816f65d6517e2ed2880f8d130c847e2382b9550389950822f');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const TYMECoin = new Blockchain();

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
TYMECoin.addTransaction(tx1);

// Mine block
TYMECoin.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
TYMECoin.addTransaction(tx2);

// Mine block
TYMECoin.minePendingTransactions(myWalletAddress);

// console.log(`Balance of Dong Le is ${TYMECoin.getBalanceOfAddress(myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// TYMECoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log('Blockchain valid?', TYMECoin.isChainValid() ? 'Yes' : 'No');
