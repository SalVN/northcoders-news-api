if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require(path.resolve(__dirname, 'config'));
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;

mongoose.connect(db, (err) => {
  if (!err) console.log('connected to the Database');
  else console.log(`error connecting to the Database ${err}`);
});

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.status(200).send('All good!');
});

app.use('/api', function () { });

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
