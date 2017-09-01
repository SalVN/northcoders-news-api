const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send('All good!');
});

module.exports = router;