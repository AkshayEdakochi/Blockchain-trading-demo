const {INITIAL_BALANCE} = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keypPair = ChainUtil.genKeyPair();
        this.publicKey = this.keypPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        Balance    : ${this.balance}
        Public Key :${this.publicKey.toString()}`;
    }

    sign(dataHash){
        return this.keypPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool,blockchain){
        this.balance = this.calculateBalance(blockchain)
        if(amount > this.balance){
            console.log(`Amount ${amount} exceeds balance: ${this.balance}`);
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this,recipient,amount);
        }
        else{
            transaction = Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];

        blockchain.chain.forEach(block => block.data.forEach( transaction =>{
            transactions.push(transaction);
        }));

        const walletInputTs = transactions
        .filter(transaction => transaction.input.address === this.publicKey);

        let startTime = 0;

        if (walletInputTs.length >0){
            const recentInputT = walletInputTs.reduce(
                (prev, curr) => prev.input.timestamp > curr.input.timestamp ? prev:curr
            );
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction => {
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey){
                        balance += output.amount;
                    } 
                });
            }
        });

        return balance;
    }

    static blockchainWallet(){
        const blockchainWallet = new this;
        blockchainWallet.address = 'blockchian-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;