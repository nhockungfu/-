var express = require('express'),
    producesRepo = require('../models/producesRepo');

var r = express.Router();

r.get('/', function(req, res) {
    producesRepo.loadAll()
        .then(function(rows) {
            var vm = {
                produces: rows
            };
            res.render('index', vm);
        }).fail(function(err) {
        console.log(err);
        res.end('fail');
    });
});

module.exports = r;