process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');

const { getUserComments, calculateUserCommentVotes } = require(path.resolve(__dirname, '..', 'src', 'utilities/getUserCommentVotes.utilities'));

describe('getUserComments', () => {
    it('is a function', () => {
        expect(getUserComments).to.be.a('function');
    });

    it('returns an array of comments', done => {
        const user = 'northcoder';
        getUserComments(user)
            .then(result => {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                result.forEach(comment => {
                    expect(comment.created_by).to.equal('northcoder');
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});

describe.only('calculateUserCommentVotes', () => {
    const comments = [{
        _id: '59b11ae18807841d9bf13234',
        body: 'comment 1',
        belongs_to: '59b11ae18807841d9bf13232',
        __v: 0,
        created_by: 'northcoder',
        votes: 8,
        created_at: 1504778977306
    },
    {
        _id: '59b11ae18807841d9bf13235',
        body: 'comment 2',
        belongs_to: '59b11ae18807841d9bf13232',
        __v: 0,
        created_by: 'northcoder',
        votes: 5,
        created_at: 1504778965843
    }];
    it('is a function', () => {
        expect(calculateUserCommentVotes).to.be.a('function');
    });

    it('returns the number of comments', () => {
        const result = calculateUserCommentVotes(comments);
        expect(result).to.be.a('number');
        expect(result).to.equal(13);
    });
});