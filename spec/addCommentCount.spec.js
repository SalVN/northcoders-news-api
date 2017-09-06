process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const { findArticleCommentCount, addArticleCommentCount } = require(path.resolve(__dirname, '..', 'src', 'utilities/addCommentCount'));

describe('findArticleCommentCount', () => {
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
        expect(findArticleCommentCount).to.be.a('function');
    });

    it('should return the comment count the of articles in an array', done => {
        const articles = usefulData.articles;
        Promise.all(findArticleCommentCount(articles))
            .then(result => {
                expect(result).to.be.an('array');
                expect(result).to.eql([2, 0]);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('should return an empty array if the input is an empty array', done => {
        Promise.all(findArticleCommentCount([]))
            .then(result => {
                expect(result).to.be.an('array');
                expect(result).to.eql([]);
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});

describe('addArticleCommentCount', () => {
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
        expect(addArticleCommentCount).to.be.a('function');
    });

    it('should return the article with a comment count key', () => {
        const articles = usefulData.articles;
        articles.forEach(article => {
            expect(article).to.not.include.keys('comment_count');
        });
        const result = addArticleCommentCount(articles, [3, 1]);
        result.forEach(article => {
            expect(article).to.include.all.keys('comment_count');
        });
    });

    it('should return the the correct comment count as part of the article object', () => {
        const articles = usefulData.articles;
        const result = addArticleCommentCount(articles, [3, 1]);
        result.forEach(article => {
            if (article.title === 'Cats are great') {
                expect(article.comment_count).to.equal(3);
            }
            if (article.title === 'Football is fun') {
                expect(article.comment_count).to.equal(1);
            }
        });
    });

});