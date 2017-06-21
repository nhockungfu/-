var express = require('express'),
    q = require('q'),
    userRepo = require('../models/userRepo'),
    categoryRepo = require('../models/categoryRepo');

var r = express.Router();

r.get('/',function (req,res) {
    categoryRepo.loadAll().then(function(rows){
      var vm = {
          categories: rows
      };
      res.render('index',vm);
    }).fail(function(err) {
        res.end('fail');
    });

});

module.exports = r;