const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');
describe('Transaction',() =>{
    let transaction, amount, recipient, senderWallet;

    beforeEach(()=>{
        amount = 50;
        recipient ='r3c1p13nt';
        senderWallet = new Wallet();
        transaction = Transaction.newTransaction(senderWallet, recipient,amount);
    });

    it('outputs `amount` subtracted from sender wallet', ()=>{
        expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount)
        .toEqual(senderWallet.balance-amount);
    });

    it('outputs `amount` with recipients address', ()=>{
        expect(transaction.outputs.find(output => output.address === recipient).amount)
        .toEqual(amount);
    });

    it('inputs the balance of the wallet', ()=> {
        expect(transaction.input.amount === senderWallet.balance);
    });



    it('validates valid transaction', ()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates invalid transaction', ()=>{
        transaction.outputs[0].amount=79;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    

    describe('Transaction with amount exceeding balance', ()=>{
        beforeEach(()=>{
            amount = 50000;
            transaction = Transaction.newTransaction(senderWallet,recipient,amount);
        });

        it('does not create transaction and logs error', ()=>{
            expect(transaction).toEqual(undefined);
        });
    });

    describe('and updating a transaction', ()=>{
        let nextAmount, nextRecipient;
        beforeEach(()=>{
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(senderWallet,nextRecipient,nextAmount);
        });
        it(`subtracts newAmount from previous sender's Amount`, ()=>{
            expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount)
            .toEqual(senderWallet.balance - nextAmount - amount);
        });

        it('output an amount for next recipient', ()=>{
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });

        describe('creating a reward transaction', () => {
            beforeEach( ()=> {
                transaction = Transaction.rewardTransaction(senderWallet,Wallet.blockchainWallet());
            });

            it(`rewards the miner's wallet`, () => {
                expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount)
                .toEqual(MINING_REWARD);
            });
        });
    });
});