const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');
const Transaction = require('./transaction');
const { validate } = require('uuid');
const Blockchain = require('../blockchain');

describe('Transaction Pool', ()=>{
    let tp,wallet,transaction;

    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = new Transaction();
        bc = new Blockchain();
        // transaction = Transaction.newTransaction(wallet,'r3c1p13nt',20);
        // tp.updateOrAddTransaction(transaction);
       transaction =  wallet.createTransaction('r3c1p13nt',30,tp,bc);
    });

    it('adds a new transaction to TransactionPool', ()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    }) ;  

    it('updates an existing transaction in Transaction pool', () =>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'n3w r3c1p13nt',50);
        tp.updateOrAddTransaction(transaction);
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
        
    });
    it ('clears the transaction pool', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and invalid transactions', () => {
        let validTransactions;
        beforeEach( () => {
            validTransactions = [...tp.transactions];
            for(let i=0; i<6; i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('r3c1p1ent0',30,tp,bc);
                if(i%2 == 0){
                    transaction.input.amount = 999999;
                }
                else{
                    validTransactions.push(transaction);
                }
            } 
        });

        it('shows a differnce between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs validTransactions from the pool', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });

    });
});