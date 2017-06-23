
var express = require('express'),
    produceDetailRepo = require('../models/produceDetailRepo');

var r = express.Router();

r.get('/', function(req, res) {
    res.render('produceDetail');
});

module.exports = r;