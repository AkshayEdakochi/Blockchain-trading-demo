
const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block{
    constructor(timestamp, lastHash, hash,data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        data      : ${this.data}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}`;
    }

    static genesis(){
        return new this("start of time", '-----', 'f1r5t h36h',[],0,DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let nonce, timestamp, hash;
        const lastHash = lastBlock.hash;
        nonce = 0;
        let {difficulty} = lastBlock;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(timestamp,lastBlock);
            hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this (timestamp, lastHash, hash,data,nonce,difficulty);
    }

    static hash(timestamp, lastHash, data,nonce,difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    static blockHash(block){
        const {timestamp, lastHash,data,nonce,difficulty} = block;
        return Block.hash(timestamp,lastHash,data,nonce,difficulty);
    }

    static adjustDifficulty(currentTime, lastBlock){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime? difficulty+1:difficulty-1;
        return difficulty;
    }
}

module.exports = Block;