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

    it('responds with status code 400 if an invalid path is provided', done => {
      request(server)
        .get('/api/monster')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('INVALID URL');
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

    describe('GET /api/topics/:topic_id/articles', () => {
      it('should respond with status code 200', done => {
        request(server)
          .get('/api/topics/football/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('should respond with status code 404 if the topic does not exist', done => {
        request(server)
          .get('/api/topics/banana/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('TOPIC NOT FOUND');
              done();
            }
          });
      });

      it('responds with status code 400 if the topic is not provided', done => {
        request(server)
          .get('/api/topics//articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('INVALID URL');
              done();
            }
          });
      });

      it('it should return an object containing an array with the key "articles"', done => {
        request(server)
          .get('/api/topics/football/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body).to.be.an('object');
              expect(res.body.articles).to.be.an('array');
              expect(res.body.articles[0]).to.be.an('object');
              done();
            }
          });
      });

      it('should respond with an array of football articles', done => {
        request(server)
          .get('/api/topics/football/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.articles).to.have.lengthOf(1);
              expect(res.body.articles[0]).to.have.any.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes');
              expect(res.body.articles[0].belongs_to).to.equal('football');
              done();
            }
          });
      });

      it('should respond with an array of cats articles', done => {
        request(server)
          .get('/api/topics/cats/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.articles).to.have.lengthOf(1);
              expect(res.body.articles[0]).to.have.any.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes');
              expect(res.body.articles[0].belongs_to).to.equal('cats');
              done();
            }
          });
      });
    });

    describe('GET /api/articles', () => {
      it('should respond with status code 200', done => {
        request(server)
          .get('/api/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('it should return an object containing an array with the key "articles"', done => {
        request(server)
          .get('/api/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body).to.be.an('object');
              expect(res.body.articles).to.be.an('array');
              expect(res.body.articles[0]).to.be.an('object');
              done();
            }
          });
      });

      it('should respond with an array of articles', done => {
        request(server)
          .get('/api/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.articles).to.have.lengthOf(2);
              res.body.articles.forEach(article => {
                expect(article).to.include.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes');
                expect(article.belongs_to).to.be.oneOf(['football', 'cats']);
                expect(article.title).to.be.oneOf(['Football is fun', 'Cats are great']);
              });
              done();
            }
          });
      });
    });


  });
});