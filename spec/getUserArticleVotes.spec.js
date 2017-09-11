process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const { getUserArticles, calculateUserArticleVotes, addUserArticleVotes } = require(path.resolve(__dirname, '..', 'src', 'utilities/getUserArticleVotes.utilities'));

describe('getUserArticles', () => {
    before(done => {
        mongoose.connection.dropDatabase()
            .then(saveTestData)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('is a function', () => {
        expect(getUserArticles).to.be.a('function');
    });

    it('returns an array of articles', done => {
        const user = 'northcoder';
        getUserArticles(user)
            .then(result => {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(1);
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

describe('calculateUserArticleVotes', () => {
    const articles = [{
        _id: '59b01acf006c8dbca914672f',
        title: 'Football is fun',
        body: 'something',
        belongs_to: 'football',
        created_by: 'northcoder',
        __v: 0,
        votes: 3,
        comment_count: 0
    },
    {
        _id: '59b01acf006c8dbca914672e',
        title: 'Cats are great',
        body: 'something',
        belongs_to: 'cats',
        created_by: 'northcoder',
        __v: 0,
        votes: 2,
        comment_count: 2
    }];
    it('is a function', () => {
        expect(calculateUserArticleVotes).to.be.a('function');
    });

    it('returns the number of comments', () => {
        const result = calculateUserArticleVotes(articles);
        expect(result).to.be.a('number');
        expect(result).to.equal(5);
    });
});

describe('addUserCommentVotes', () => {
    let usefulData;
    beforeEach(done => {
        mongoose.connection.dropDatabase()
            .then(saveTestData)
            .then(data => {
                usefulData = data;
                done();
            })
            .catch(done);
    });
    it('is a function', () => {
        expect(addUserArticleVotes).to.be.a('function');
    });

    it('should return the user with a comment_votes key', () => {
        const user = usefulData.user;
        const result = addUserArticleVotes(user, 13);
        expect(result).to.be.an('object');
        expect(result).to.include.keys('_id', 'name', 'username', 'avatar_url', '__v', 'articles_vote_count');
        expect(result.articles_vote_count).to.equal(13);
    });
});