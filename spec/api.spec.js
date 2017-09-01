process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const Articles = require(path.resolve(__dirname, '..', 'models', 'articles'));

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

    describe('GET /api/articles/:article_id/comments', () => {
      it('should respond with status code 200', done => {
        request(server)
          .get(`/api/articles/${usefulData.articles[0]._id}/comments`)
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('should respond with status code 404 if the article_id does not exist', done => {
        request(server)
          .get('/api/articles/5555/comments')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('ARTICLE NOT FOUND');
              done();
            }
          });
      });

      it('should respond with status code 400 if the topic is not provided', done => {
        request(server)
          .get('/api/topics//comments')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('INVALID URL');
              done();
            }
          });
      });

      it('should respond with an array containing objects', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .get(`/api/articles/${article._id}/comments`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body).to.be.an('object');
                  expect(res.body.comments).to.be.an('array');
                  expect(res.body.comments[0]).to.be.an('object');
                  done();
                }
              });
          });
      });

      it('should respond with an array of comments', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .get(`/api/articles/${article._id}/comments`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.comments).to.have.lengthOf(2);
                  res.body.comments.forEach(comment => {
                    expect(comment).to.have.any.keys('_id', 'body', 'belongs_to', 'created_by', 'votes', 'created_at', '_v');
                    expect(comment.belongs_to).to.equal(article._id.toString());
                    expect(comment.body).to.be.oneOf(['this is a comment', 'this is another comment']);
                  });
                  done();
                }
              });
          });
      });
    });

    describe('POST /api/articles/:article_id/comments', () => {
      it('should respond with status code 201', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .post(`/api/articles/${article._id}/comments`)
              .send({ "body": "this is my comment", "created_by": "Northcoder" })
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(201);
                }
                done();
              });
          });

      });

      it('should respond with status code 404 if the article_id does not exist', done => {
        request(server)
          .post('/api/articles/5555/comments')
          .send({ "body": "this is my comment", "created_by": "Northcoder" })
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('ARTICLE DOES NOT EXIST');
              done();
            }
          });
      });

      it('responds with status code 400 if the topic is not provided', done => {
        request(server)
          .get('/api/topics//comments')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('INVALID URL');
              done();
            }
          });
      });

      it('returns the added comment', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .post(`/api/articles/${article._id}/comments`)
              .send({ "body": "this is my comment", "created_by": "Northcoder" })
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body).to.be.an('object');
                  expect(res.body.savedComment).to.be.an('object');
                  expect(res.body.savedComment).to.have.any.keys('_id', 'body', 'belongs_to', 'created_by', 'votes', 'created_at', '_v');
                  expect(res.body.savedComment.body).to.equal('this is my comment');
                  expect(res.body.savedComment.created_by).to.equal('Northcoder');
                  expect(res.body.savedComment.belongs_to).to.equal(article._id.toString());
                }
                done();
              });
          });
      });

      it('adds the comment to the database', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .post(`/api/articles/${article._id}/comments`)
              .send({ "body": "this is my comment", "created_by": "northcoder" })
              .end((err) => {
                if (err) done(err);
                else {
                  request(server)
                    .get(`/api/articles/${article._id}/comments`)
                    .end((err, res) => {
                      if (err) done(err);
                      else {
                        expect(res.body).to.be.an('object');
                        expect(res.body.comments).to.have.lengthOf(3);
                        res.body.comments.forEach(comment => {
                          expect(comment).to.be.an('object');
                          expect(comment.body).to.be.oneOf(['this is a comment', 'this is another comment', 'this is my comment']);
                          expect(comment.created_by).to.equal('northcoder');
                        });
                        done();
                      }
                    });
                }
              });
          });
      });
    });

    describe('PUT /api/articles/:article_id', () => {
      it('should respond with status code 200', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .put(`/api/articles/${article._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(200);
                }
                done();
              });
          });
      });

      it('responds with status code 404 if the article_id does not exist', done => {
        request(server)
          .put('/api/articles/555?vote=up')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('ARTICLE NOT FOUND');
              done();
            }
          });
      });

      it('vote=up should increment the vote count', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .put(`/api/articles/${article._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.article._id).to.eql(article._id.toString());
                  expect(res.body.article.votes).to.equal(1);
                  done();
                }
              });
          });
      });

      it('vote=down should decrement the vote count', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .put(`/api/articles/${article._id}?vote=down`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.article._id).to.eql(article._id.toString());
                  expect(res.body.article.votes).to.equal(-1);
                  done();
                }
              });
          });
      });

      it('will respond to multiple vote=up / vote=down requests correctly', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .put(`/api/articles/${article._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.article.votes).to.equal(1);
                  request(server)
                    .put(`/api/articles/${article._id}?vote=up`)
                    .end((err, res) => {
                      if (err) done(err);
                      else {
                        expect(res.body.article.votes).to.equal(2);
                        request(server)
                          .put(`/api/articles/${article._id}?vote=down`)
                          .end((err, res) => {
                            if (err) done(err);
                            else {
                              expect(res.body.article.votes).to.equal(1);
                              done();
                            }
                          });
                      }
                    });
                }
              });
          });
      });
    });
  });
});