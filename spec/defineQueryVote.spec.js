const path = require('path');
const { expect } = require('chai');

const defineQueryVote = require(path.resolve(__dirname, '..', 'src', 'utilities/defineQueryVote'));

describe('defineQueryVote', () => {
    it('is a function', () => {
        expect(defineQueryVote).to.be.a('function');
    });

    it('should return 1 if the query is up', () => {
        const req = {
            query: {
                vote: 'up'
            }
        };
        expect(defineQueryVote(req)).to.equal(1);
    });

    it('should return -1 if the query is down', () => {
        const req = {
            query: {
                vote: 'down'
            }
        };
        expect(defineQueryVote(req)).to.equal(-1);
    });

    it('should return an object containing a status and a message if the query is invalid', () => {
        const req = {
            query: { vote: 'banana' }
        };
        const reqEmpty = {
            query: { vote: '' }
        };
        const next = (obj) => { return obj; };
        expect(defineQueryVote(req, null, next)).to.eql({ status: 422, message: 'INVALID QUERY' });
        expect(defineQueryVote(reqEmpty, null, next)).to.eql({ status: 422, message: 'INVALID QUERY' });
    });
});