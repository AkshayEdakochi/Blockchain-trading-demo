const Block = require('./block');

describe('Block', () => {
    let data, lastBlock, block;
    beforeEach(() =>{
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });
    it('sets the `data` to match input',() => {
        expect(block.data).toEqual(data);
    });
    it('sets `lastHash` of new block to hash of block',() => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates hash with DIFFICULTY number of preceding 0s', ()=>{
        expect(block.hash.substring(0,block.difficulty) === '0'.repeat(block.difficulty));
        console.log(block.toString());
    });

    it('lowers difficulty when time differnce is too large', ()=>{
        expect(Block.adjustDifficulty(block.timestamp+360000, block)).toEqual(block.difficulty-1);
    });

    it('raises difficulty for quickly mined block', () => {
        expect(Block.adjustDifficulty(block.timestamp+1, block)).toEqual(block.difficulty+1);
    });
});