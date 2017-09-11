process.env.NODE_ENV = 'test';

const path = require('path');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

const Articles = require(path.resolve(__dirname, '..', 'models', 'articles'));
const Comments = require(path.resolve(__dirname, '..', 'models', 'comments'));

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

    describe('GET /api/topics', () => {
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
              expect(res.body.articles[0]).to.have.any.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes', 'comment_count');
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
              expect(res.body.articles[0]).to.have.any.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes', 'comment_count');
              expect(res.body.articles[0].belongs_to).to.equal('cats');
              done();
            }
          });
      });

      it('should respond with an array of cats articles which includes a comment count', done => {
        request(server)
          .get('/api/topics/cats/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.articles[0].comment_count).to.equal(2);
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
                expect(article).to.include.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes', 'comment_count');
                expect(article.belongs_to).to.be.oneOf(['football', 'cats']);
                expect(article.title).to.be.oneOf(['Football is fun', 'Cats are great']);
              });
              done();
            }
          });
      });

      it('includes the correct comment count', done => {
        request(server)
          .get('/api/articles')
          .end((err, res) => {
            if (err) done(err);
            else {
              res.body.articles.forEach(article => {
                if (article.title === 'Cats are great') {
                  expect(article.comment_count).to.equal(2);
                }
                if (article.title === 'Football is fun') {
                  expect(article.comment_count).to.equal(0);
                }
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

      it('resolves with a status code 422 if the vote query is not valid', done => {
        Articles.findOne({ title: 'Cats are great' })
          .then((article) => {
            request(server)
              .put(`/api/articles/${article._id}?vote=banana`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(422);
                  expect(res.body.message).to.equal('INVALID QUERY');
                  done();
                }
              });
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

      it('vote=up should return the updated article object', done => {
        let chosenArticle;
        Articles.findOne({ title: 'Cats are great' })
          .then(article => {
            chosenArticle = article;
            request(server)
              .put(`/api/articles/${article._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.article).to.include.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes', 'comment_count');
                  expect(res.body.article.title).to.equal(chosenArticle.title);
                  expect(res.body.article.body).to.equal(chosenArticle.body);
                  expect(res.body.article.belongs_to).to.equal(chosenArticle.belongs_to);
                  expect(res.body.article.comment_count).to.equal(2);
                  done();
                }
              });
          });
      });

      it('vote=down should return the updated article object', done => {
        let chosenArticle;
        Articles.findOne({ title: 'Cats are great' })
          .then(article => {
            chosenArticle = article;
            request(server)
              .put(`/api/articles/${article._id}?vote=down`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.article).to.include.keys('_id', 'title', 'body', 'belongs_to', '__v', 'votes', 'comment_count');
                  expect(res.body.article.title).to.equal(chosenArticle.title);
                  expect(res.body.article.body).to.equal(chosenArticle.body);
                  expect(res.body.article.belongs_to).to.equal(chosenArticle.belongs_to);
                  expect(res.body.article.comment_count).to.equal(2);
                  done();
                }
              });
          });
      });
    });

    describe('PUT /api/comments/:comment_id', () => {
      it('responds with status code 200', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .put(`/api/comments/${comment._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(200);
                }
                done();
              });
          });
      });

      it('responds with status code 404 if the comment_id does not exist', done => {
        request(server)
          .put('/api/comments/555?vote=up')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('COMMENT NOT FOUND');
              done();
            }
          });
      });

      it('responds with a status code 422 if the vote query is not valid', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .put(`/api/comments/${comment._id}?vote=banana`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(422);
                  expect(res.body.message).to.equal('INVALID QUERY');
                  done();
                }
              });
          });
      });

      it('vote=up should increment the vote count', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .put(`/api/comments/${comment._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.comment._id).to.eql(comment._id.toString());
                  expect(res.body.comment.votes).to.equal(1);
                  done();
                }
              });
          });
      });

      it('vote=down should decrement the vote count', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .put(`/api/comments/${comment._id}?vote=down`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.comment._id).to.eql(comment._id.toString());
                  expect(res.body.comment.votes).to.equal(-1);
                  done();
                }
              });
          });
      });

      it('will respond to multiple vote=up / vote=down requests correctly', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .put(`/api/comments/${comment._id}?vote=up`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body.comment.votes).to.equal(1);
                  request(server)
                    .put(`/api/comments/${comment._id}?vote=up`)
                    .end((err, res) => {
                      if (err) done(err);
                      else {
                        expect(res.body.comment.votes).to.equal(2);
                        request(server)
                          .put(`/api/comments/${comment._id}?vote=down`)
                          .end((err, res) => {
                            if (err) done(err);
                            else {
                              expect(res.body.comment.votes).to.equal(1);
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

    describe('DELETE /api/comments/:comment_id', () => {
      it('should respond with status code 200', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .delete(`/api/comments/${comment._id}`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.status).to.equal(200);
                }
                done();
              });
          });
      });

      it('responds with status code 400 if the comment_id is not provided', done => {
        request(server)
          .delete('/api/comments/')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('INVALID URL');
              done();
            }
          });
      });

      it('responds with status code 404 if the comment_id does not exist', done => {
        request(server)
          .delete('/api/comments/555')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('COMMENT NOT FOUND');
              done();
            }
          });
      });

      it('should return the deleted comment', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .delete(`/api/comments/${comment._id}`)
              .end((err, res) => {
                if (err) done(err);
                else {
                  expect(res.body).to.be.an('object');
                  expect(res.body.deletedComment).to.be.an('object');
                  expect(res.body.deletedComment.body).to.equal('this is a comment');
                }
                done();
              });
          });
      });

      it('should remove the comment from the database', done => {
        Comments.findOne({ body: 'this is a comment' })
          .then((comment) => {
            request(server)
              .delete(`/api/comments/${comment._id}`)
              .end((err) => {
                if (err) done(err);
                else {
                  request(server)
                    .get(`/api/articles/${comment.belongs_to}/comments`)
                    .end((err, res) => {
                      if (err) done(err);
                      else {
                        expect(res.body.comments).to.have.lengthOf(1);
                        expect(res.body.comments.body).to.not.equal('this is a comment');
                        done();
                      }
                    });
                }
              });
          });
      });

    });

    describe(`GET /api/users/:username`, () => {
      it('responds with status code 200', done => {
        request(server)
          .get(`/api/users/northcoder`)
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
            }
            done();
          });
      });

      it('responds with status code 400 if the username is not provided', done => {
        request(server)
          .get('/api/topics/users/')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('INVALID URL');
              done();
            }
          });
      });

      it('responds with status code 404 if the username does not exist', done => {
        request(server)
          .get(`/api/users/abcde`)
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('USER NOT FOUND');
              done();
            }
          });
      });

      it('should return the user profile', done => {
        request(server)
          .get(`/api/users/northcoder`)
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body).to.be.an('object');
              expect(res.body.user).to.be.an('object');
              expect(res.body.user).to.include.keys('_id', 'name', 'username', 'avatar_url', 'comment_count');
              expect(res.body.user.name).to.equal('Awesome Northcoder');
              expect(res.body.user.username).to.equal('northcoder');
              done();
            }
          });
      });

      it('should include the correct comment_count', done => {
        request(server)
          .get(`/api/users/northcoder`)
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.user.comment_count).to.equal(2);
              done();
            }
          });
      });
    });

    describe('GET /api/users', () => {
      it('should respond with status code 200', done => {
        request(server)
          .get('/api/users')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });

      it('it should return an object containing an array with the key "users"', done => {
        request(server)
          .get('/api/users')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body).to.be.an('object');
              expect(res.body.users).to.be.an('array');
              expect(res.body.users[0]).to.be.an('object');
              done();
            }
          });
      });

      it('should respond with an array of users', done => {
        request(server)
          .get('/api/users')
          .end((err, res) => {
            if (err) done(err);
            else {
              expect(res.body.users).to.have.lengthOf(1);
              expect(res.body.users[0]).to.include.keys('_id', 'username', 'name', 'avatar_url', '__v');
              expect(res.body.users[0].username).to.equal('northcoder');
              expect(res.body.users[0].name).to.equal('Awesome Northcoder');
              expect(res.body.users[0].avatar_url).to.equal('https://avatars3.githubusercontent.com/u/6791502?v=3&s=200');
              done();
            }
          });
      });

    });

  });
});
