const Block = require('./block');

class Blockchain{
    
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        const block = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);

        return this.chain;
    }

    isValidChain(chain){

        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) 
                return false;
        }
        return true;
    }

    replaceChain(newChain){
        if (this.chain.length >= newChain.length) {
            console.log("incoming chain length less than current chain");
            return;
        }
        else if(!this.isValidChain(newChain)){
            console.log("incoming chain invalid");
            return;
        }
        console.log('chain replaced');
        this.chain = newChain;
        return;
    }
}

module.exports = Blockchain;