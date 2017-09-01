process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

describe('API', function () {
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
  describe('GET /', function () {
    it('responds with status code 200', function (done) {
      request(server)
        .get('/')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            done();
          }
        });
    });

    describe('GET /api/articles', () => {
      it('responds with status code 200', done => {
        request(server)
          .get('/api/topics')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('it should return an object containing an array with the key topics', done => {
        request(server)
          .get('/api/topics')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body).to.be.an('object');
              expect(res.body.topics).to.be.an('array');
              expect(res.body.topics[0]).to.be.an('object');
              done();
            }
          });
      });

      it('should return the expected objects from the database', done => {
        request(server)
          .get('/api/topics')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.topics).to.have.lengthOf(3);
              res.body.topics.forEach(topic => {
                expect(topic).to.include.keys('title', 'slug', '_id');
                expect(topic.title).to.be.oneOf(['Football', 'Cats', 'Cooking']);
                expect(topic.slug).to.be.oneOf(['football', 'cats', 'cooking']);
                expect(topic._id).to.be.a('string');
              });
              done();
            }
          });
      });
    });

  });
});