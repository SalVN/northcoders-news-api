process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const { getUserComments, calculateUserCommentVotes, addUserCommentVotes } = require(path.resolve(__dirname, '..', 'src', 'utilities/getUserCommentVotes.utilities'));

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
            .catch(done);
    });
});

describe('calculateUserCommentVotes', () => {
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

describe('addUserCommentVotes', () => {
    beforeEach(done => {
        mongoose.connection.dropDatabase()
            .then(saveTestData)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('is a function', () => {
        expect(addUserCommentVotes).to.be.a('function');
    });

    it('should return the user with a comment_votes key', () => {
        const user = {
            __v: 0,
            username: 'northcoder',
            name: 'Awesome Northcoder',
            avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200',
            _id: '59b69737305d5114710757d6'
        };
        const result = addUserCommentVotes(user, 13);
        expect(result).to.be.an('object');
        expect(result).to.include.keys('_id', 'name', 'username', 'avatar_url', '__v', 'comments_vote_count');
        expect(result.comments_vote_count).to.equal(13);
    });
});