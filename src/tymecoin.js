const {Blockchain} = require('./blockchain');
const {Transaction} = require('./transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// the private key and public key go here
const myKey = ec.keyFromPrivate('5970ca079d3a4b877e560f8f9f14233299c1b479a95ba1000bd421300bc6cfa5');
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const TYMECoin = new Blockchain();

// Create a transaction & sign it
const tx1 = new Transaction(myWalletAddress, 'address1', 1);
tx1.signTransaction(myKey);
TYMECoin.addTransaction(tx1);

// Mine block
TYMECoin.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address2', 3);
tx2.signTransaction(myKey);
TYMECoin.addTransaction(tx2);

// Mine block
TYMECoin.minePendingTransactions(myWalletAddress);

console.log(`Balance of wallet is ${TYMECoin.getBalanceOfAddress(myWalletAddress)}`);
console.log(`TXs of wallet is ${JSON.stringify(TYMECoin.getAllTransactionsForWallet(myWalletAddress), null, '\t')}`);

// Uncomment this line to check tampering
// TYMECoin.chain[1].transactions[0].amount = 1000;

// Check if the chain is valid
console.log('Blockchain valid?', TYMECoin.isChainValid() ? 'Yes' : 'No');