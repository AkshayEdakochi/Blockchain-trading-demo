const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', ()=>{
    let wallet, tp;
    beforeEach( ()=> {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc= new Blockchain();
    });

    describe('creating a Transaction', ()=>{
        let transaction, sendAmount, recipient;

        beforeEach( () => {
            sendAmount = 50;
            recipient = 'r4nd0m-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount, tp,bc);
        });

        describe('and doing the same transaction', () => {
            beforeEach( () => {
                wallet.createTransaction(recipient,sendAmount,tp,bc);
            });

            it('doubles `sendAmount` subtracted from wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - sendAmount*2);
            });

            it('clones the `sendAmount` output for recipient', () => {
                expect(transaction.outputs.filter( output => output.address === recipient)
                .map(output => output.amount)).toEqual([sendAmount,sendAmount]);
            });
        });
    });
    describe('calculating balance', () =>{
        let addBalance, repeatAdd, senderWallet;

        beforeEach( ()=>{
            addBalance = 100;
            repeatAdd = 3;
            senderWallet = new Wallet();

            for(let i=0; i<repeatAdd; i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,tp,bc);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates balance for recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + addBalance* repeatAdd);
        });

        it('calculates balance of sender wallet', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance*repeatAdd);
        });

        describe('and the recipient conducts a transaction', () => {
            let subtractBalance, recipientBalance;

            beforeEach( ()=> {
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,tp,bc);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to recipient', () => {
                beforeEach( ()=> {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc);
                    bc.addBlock(tp.transactions);
                });

                it('calculates recipient ballance using the most recent transaction', ()=> {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
    
            });
        });

    });
});