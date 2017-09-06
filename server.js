if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const config = require(path.resolve(__dirname, 'config'));
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;

const router = require(path.resolve(__dirname, 'src', 'router', 'routes'));
app.use(cors());

mongoose.connect(db, (err) => {
  if (!err) console.log('connected to the Database');
  else console.log(`error connecting to the Database ${err}`);
});

app.use(bodyParser.json());

app.use(router);

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  next(err);
});

app.use((err, req, res) => {
  res.status(500).json({ message: 'SERVER ERROR' });
});

module.exports = app;
