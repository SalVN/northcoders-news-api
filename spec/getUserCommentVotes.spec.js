process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const { getUserComments } = require(path.resolve(__dirname, '..', 'src', 'utilities/getUserCommentVotes.utilities'));

describe.only('getUserComments', () => {
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
        expect(getUserComments).to.be.a('function');
    });

    it('returns an array of comments', done => {
        const user = usefulData.user;
        getUserComments(user.username) 
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