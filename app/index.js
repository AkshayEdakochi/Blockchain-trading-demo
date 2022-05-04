const express = require('express');
const BodyPaser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer  =require('./p2p-server');
const Wallet = require('../wallet/index');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
const  cors = require('cors');
// import {P2P_PORT, peers} from  


const HTTP_PORT = process.env.HTTP_PORT || 3001; 

const app = express();
app.use(cors());
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner  = new Miner(bc,tp,wallet,p2pServer);


app.use(BodyPaser.json());

app.get('/blocks',(req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req,res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added : ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions', (req,res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient,amount,tp,bc);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/public-key', (req, res) => {
    res.json({publicKey : wallet.publicKey});
});

app.get('/mine-transactions', (req,res) => {
    const block = miner.mine();
    console.log(`New block added ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/http-port', (req,res) => {
    console.log(HTTP_PORT);
    res.json(HTTP_PORT);
});

app.get('/p2p-port', (req,res) => {
    console.log(p2pServer.peers);
    res.json(p2pServer.P2P_PORT);
});

app.get('/balance', (req, res) => {
    res.json(wallet.calculateBalance(bc));
});
app.listen(HTTP_PORT, () => {console.log(`Listening at ${HTTP_PORT}`)});


p2pServer.listen();