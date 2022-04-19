const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner{
    constructor(blockchain,transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();
        //include a reward for the miner
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        //create a block with the transaction as data
        const block = this.blockchain.addBlock(validTransactions);
        //synch the chains in the p2pServer
        this.p2pServer.syncChains();
        //clear the transaction pool
        this.transactionPool.clear();
        //broadcast to every miner to clear the transaction pool
        this.p2pServer.broadcastClearTransactions();
        
        return block;
    }
}

module.exports = Miner;