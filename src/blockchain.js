const {Block} = require('./block');
const {Transaction} = require('./transaction');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;            // todo: move to config file
    this.miningReward = 0;         // todo: move to config file, add more logic later
    this.pendingTransactions = [];
    // todo: store TXs which missed their parents
  }

  createGenesisBlock() {
    let address = '04be128292e3850bb1ec167835d8dae5be4cec21c38b5951a565205c0597a2f7cff12fcc2626e22769d084576f9267db0b3f3157c0b9382220ad47c21cd180fc8f';
    //pK: 5970ca079d3a4b877e560f8f9f14233299c1b479a95ba1000bd421300bc6cfa5
    const genesisTx = new Transaction(null, address, 1000000);
    return new Block(Date.parse('2019-04-19'), [genesisTx], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // todo: process some pending txs, not all pending txs
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    block.heigh = this.getLatestBlock().heigh+1;
    this.chain.push(block);
    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if(this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount)
    {
      throw new Error('Balance amount must not be less than transaction amount');
    }

    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    this.pendingTransactions.push(transaction);
  }

  getPendingTransaction()
  {
    return this.pendingTransactions;
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    return txs;
  }

  checkTransactionExist(transaction)
  {
    for (const tx of pendingTransactions) {
      if (tx.calculateHash() === transaction.calculateHash())
      {
        return true;
      }
    }
    return false;
  }

  checkBlockExist(block)
  {
    for (const bl of Blockchain.chain) {
      if(bl.hash === block.hash)
      {
        return true;
      }
    }
    return false;
  }

  IsValidNextBlock(block)
  {
    return block.previousHash === getLatestBlock().hash
           && block.hash === block.calculateHash() 
           && block.hasValidTransactions();    
  }

  isChainValid() {
    // Check if the Genesis block hasn't been tampered with
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check if block hashes and signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
  
// Listen new TXs
// When recieve new TXs
HandleIncomingTx(tx)
{
    if (!isChainValid(tx) || checkTransactionExist(tx))
    {
        return;
    }
    addTransaction(tx);
    // todo: broadcast the TX to other nodes

    // Start mining if the number of TXs is greater than 2
    if (pendingTransactions.length() > 2)
    {
        // Mine block
        TYMECoin.minePendingTransactions(myWalletAddress);
    }
    // todo: to broadcast new block
}

// listen new block
// when recieve new block
HandleIncomingBlock(block)
{
    //Check block is in chain
    if(!IsValidNextBlock(block))
    {
        return;
    }
    chain.push(block);
    //todo: broadcast to other nodes
}

// Ask for lasted blockchain
GetBlockchain()
{
    // todo: broadcast request
}

// Listen blockchain info
UpdateChain(newchain)
{
    if(isChainValid(newchain))
    {
        chain = newchain;
    }
}

// Send lasted blockchain
// Listen blockchin info request
SendBlockchain()
{
      // todo: broadcast lasted blockchain
}
  
}

module.exports.Blockchain = Blockchain;