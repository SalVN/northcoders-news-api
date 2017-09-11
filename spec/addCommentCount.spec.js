process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const { findArrayCommentCount, addArrayCommentCount, findOneCommentCount, addOneCommentCount } = require(path.resolve(__dirname, '..', 'src', 'utilities/addCommentCount'));

describe('findArrayCommentCount', () => {
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
        expect(findArrayCommentCount).to.be.a('function');
    });

    it('should return the comment count the of articles in an array', done => {
        const articles = usefulData.articles;
        Promise.all(findArrayCommentCount(articles))
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
        Promise.all(findArrayCommentCount([]))
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

describe('addArrayCommentCount', () => {
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
        expect(addArrayCommentCount).to.be.a('function');
    });

    it('should return the article with a comment count key', () => {
        const articles = usefulData.articles;
        articles.forEach(article => {
            expect(article).to.not.include.keys('comment_count');
        });
        const result = addArrayCommentCount(articles, [3, 1]);
        result.forEach(article => {
            expect(article).to.include.all.keys('comment_count');
        });
    });

    it('should return the the correct comment count as part of the article object', () => {
        const articles = usefulData.articles;
        const result = addArrayCommentCount(articles, [3, 1]);
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

describe('findOneCommentCount', () => {
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
        expect(findOneCommentCount).to.be.a('function');
    });

    it('should return the comment count the of article', done => {
        const article = usefulData.articles[0];
        findOneCommentCount(article)
            .then(result => {
                expect(result).to.be.a('number');
                expect(result).to.eql(2);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('should return 0 if the input is an empty object', done => {
        findOneCommentCount({})
            .then(result => {
                expect(result).to.be.a('number');
                expect(result).to.eql(0);
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});

describe('addOneCommentCount', () => {
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
        expect(addOneCommentCount).to.be.a('function');
    });

    it('should return the article with a comment count key', () => {
        const article = usefulData.articles[0];
        expect(article).to.not.include.keys('comment_count');
        const result = addOneCommentCount(article, 3);
        expect(result).to.include.all.keys('comment_count');
    });

    it('should return the the correct comment count as part of the article object', () => {
        const article = usefulData.articles[0];
        const result = addOneCommentCount(article, 3);
        expect(result.comment_count).to.equal(3);
    });
});