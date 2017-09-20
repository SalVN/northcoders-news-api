## Northcoders News API

### Background

Northcoders News is a social news aggregation, web content rating, and discussion website. It is similar to [Reddit](https://www.reddit.com/)

This project contains the API, which utilises a NoSQL database and Express server.

The front-end of the project is available at <https://github.com/SalVN/northcoders-news-front-end>.

## Getting Started

To run the API, the following steps should be taken:

### Prerequisites

This project requires [nodejs](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm) and [mongoDB](https://docs.mongodb.com/manual/administration/install-community/) to be installed on your machine. To use the start command [nodemon](https://nodemon.io/) also needs to be installed, although an alternative command is available using node.

<b>Node</b>

To confirm you have Node installed on your machine, run the following code in the command line (Node v7.9.0 was used for this project).
```
node --version
```
If nodejs is not installed on your machine, it is available from <https://nodejs.org/en/download/>.

<b>npm</b>

To confirm you have npm installed locally, the following command line code can be used (npm 4.2.0 was used for this project).
```
npm -v
```

If you don't have npm installed on your machine, instructions for installing npm can be found at [https://www.npmjs.com/get-npm].

<b>MongoDB</b>

To confirm local installation, type the following in the command line (db version v3.4.4 was used for this project).
```
mongod --version
``` 
Instructions for downloading the community edition of MongoDB are available at (https://docs.mongodb.com/manual/administration/install-community/).

I used the [Robo3T](https://robomongo.org/download) MongoDB management tool.

<b>Nodemon</b>
Check installation using:
```
nodemon -v
```
The machine used for this project had 1.11.0 installed.

If you need to install nodemon, it can be installed via npm using
```
npm install -g nodemon
```
Documentation is available [here](https://nodemon.io/).

### Instructions

1. Install dependencies

After cloning the project into a new file from from [Github](https://github.com/SalVN/w07-northcodersnews-api), navigate to the root file and use npm or yarn to install the dependencies on your machine.

```
npm install
```

2. Seed the database using the command
```
node seed/seed.js
```

3. Start the server

If you have nodemon installed globally, the server can be started using:
```
npm start
```
Otherwise, the following command can be used:
```
node server.js
```

4. Check the server is working.

The project will run locally on <http://localhost:3000>.

If the server is working, you will see the message 'All good!'.

If you need to alter the port, this can be done from the config.js file. Ensure to change only the dev port. If you are running the [front-end project](https://github.com/SalVN/northcoders-news-front-end), the config file will also need to be changed to reflect any updates.

5. Run the front end.

If you wish to run the corresponding front end user interface, after the API is running, it is available from <https://github.com/SalVN/northcoders-news-front-end>

## Functionality and Routes

These are the routes available on the API.

The GET routes can be viewed on <http://localhost:3000>.

| Route |   |
| ------|---|
| `GET /api/topics` | Get all the topics |
| `GET /api/topics/:topic_id/articles` | Return all the articles for a certain topic |
| `GET /api/articles` | Returns all the articles |
| `GET /api/articles/:article_id/comments` | Get all the comments for a individual article |
| `POST /api/articles/:article_id/comments` | Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"} |
| `PUT /api/articles/:article_id` | Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: /api/articles/:article_id?vote=up |
| `PUT /api/comments/:comment_id` | Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: /api/comments/:comment_id?vote=down |
| `DELETE /api/comments/:comment_id` | Deletes a comment |
| `GET /api/users/:username` | Returns a JSON object with the profile data for the specified user. |
| `GET /api/users` | Get a list of all the users |

## Test Suite

A test suite has been used to test some aspects of the reducer (the actions and reducer files).
The tests run on [Mocha]c using the [Chai Assertion Library (expect)](http://chaijs.com/guide/styles/#expect). [Supertest](https://www.npmjs.com/package/supertest) has been used for testing http requests.

To run the tests, use the following command in the terminal.
```
npm test
```
The [Istanbul nyc coverage tests](https://istanbul.js.org/) have been used to check test coverage.

### Uses

The front-end server, available from <https://github.com/SalVN/northcoders-news-front-end>, also needs to be running to see the full project, although the API can be accessed without this running.

Whilst a full list of dependencies is available on the package.json, the main libraries used are:

PROJECT
* [Express](https://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Underscore](http://underscorejs.org/)

TESTING
* [Mocha](https://mochajs.org/)
* [Chai](http://chaijs.com/guide/styles/#expect)
* [Supertest](https://www.npmjs.com/package/supertest)
* [Istanbul NYC](https://istanbul.js.org/)

### Authors

[Sally Newell](https://github.com/SalVN/)

### Acknowledgments

Completed as part of a project on the [Northcoders](https://northcoders.com/) Course.