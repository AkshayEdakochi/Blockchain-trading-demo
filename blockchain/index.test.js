const Block = require('./block');
const Blockchain = require('./index');

describe('Blockcahin',() => {
    let bc,bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain(); 
    });

    it('checks if first block is genesis', () =>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a block', ()=>{
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates valid chain', () => {
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);

    });

    it('invalidates chain with wrong genesis', () =>{
        bc2.chain[0].data = "bad data";

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates chain with corrupt data', () =>{
        bc2.addBlock('foo');
        bc2.addBlock('bar');
        bc2.chain[1].data = 'faa';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates chain with corrupt hash', () =>{
        bc2.addBlock('foo');
        bc2.addBlock('bar');
        bc2.chain[2].lastHash = 'blah';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces valid chain' ,() =>{
        bc2.addBlock('rengoku');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('rejects chain smaller than current chain', () => {
        bc.addBlock('zenitsu');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

    it('rejects invalid incoming chain' ,() =>{
        bc2.addBlock('giu');
        bc2.chain[1].data = 'muzan';

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    })

});