var express = require('express');
var router = express.Router();

const expamples = [{ id: 1, name: 'Do something', completed: false }];

// /examples/
router.get('/', function (req, res, next) {
  res.json(expamples);
});

module.exports = router;
