var express = require('express'),
    categoryRepo = require('../models/categoryRepo'),
    q = require('q');

var r = express.Router();

r.get('/', function(req, res) {
    var vm = {
        layout: false,
    };
    res.render('dangNhap', vm);
});
module.exports = r;
