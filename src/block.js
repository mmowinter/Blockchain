const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.nonce = 0;
      this.hash = this.calculateHash();
      this.heigh = 0;
    }
  
    calculateHash() {
      return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
  
    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.hash = this.calculateHash();
      }
      
      console.log(`Block mined: ${this.hash}`);
    }
  
    hasValidTransactions() {
      for (const tx of this.transactions) {
        if (!tx.isValid()) {
          console.log(`Invalid transaction: ${JSON.stringify(tx, null, '\t')}`);
          return false;
        }
      }
  
      return true;
    }
  }

module.exports.Block = Block;