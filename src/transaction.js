const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
      this.fromAddress = fromAddress;
      this.toAddress = toAddress;
      this.amount = amount;
      this.timestamp = Date.now(); // need to consider timezone?
    }
  
    calculateHash() {
      return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
    }
  
    signTransaction(signingKey) {
      // from the wallet that is linked to your key
      if (signingKey.getPublic('hex') !== this.fromAddress) {
        throw new Error('You cannot sign transactions for other wallets!');
      }
      
      // sign it with private key and store inside the transaction
      const hashTx = this.calculateHash();
      const sig = signingKey.sign(hashTx, 'base64');
      this.signature = sig.toDER('hex');
    }
  
    /**
     * Checks if the signature is valid (transaction has not been tampered with).
     * It uses the fromAddress as the public key.
     */
    isValid() {
      // mining reward transaction doesn't have a from address
      if (this.fromAddress === null) return true; // need other checks later: reward...
  
      if (!this.signature || this.signature.length === 0) {
        throw new Error('No signature in this transaction');
      }
  
      const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
      return publicKey.verify(this.calculateHash(), this.signature);
    }
  }

  module.exports.Transaction = Transaction;