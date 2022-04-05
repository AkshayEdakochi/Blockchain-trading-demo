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
});