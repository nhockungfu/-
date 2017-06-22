var express = require('express'),
    q = require('q'),
    userRepo = require('../models/userRepo'),
    categoryRepo = require('../models/categoryRepo'),
    producesRepo = require('../models/producesRepo');

var dateFormat = require('dateformat');

var r = express.Router();

r.get('/',function (req,res) {
    // categoryRepo.loadAll().then(function(rows){
    //   var vm = {
    //       categories: rows
    //   };
    //   res.render('index',vm);
    // }).fail(function(err) {
    //     res.end('fail');
    // });

    // var vm = {
    //     categories: null,
    //     produces: null
    // };
    //
    // //load categories
    // categoryRepo.loadAll().then(function(rows){
    //     vm.categories = rows;
    // }).fail(function(err) {
    //     console.log(err);
    //     res.end('fail');
    // });
    //
    // //load produces
    // producesRepo.loadAll().then(function(rows) {
    //         vm.produces = rows;
    //         res.render('index', vm);
    //     }).fail(function(err) {
    //     console.log(err);
    //     res.end('fail');
    // });

    q.all([
        categoryRepo.loadAll(),
        producesRepo.loadTopNDesc('num_bid', 3),
        producesRepo.loadTopNDesc('highest_price', 3),
        producesRepo.loadTopNDesc('poor_time', 3)
    ]).spread(function (cateRows,topDesc_numBids, topDesc_price, topDesc_poorTime) {
        var now = new Date();
        dateFormat(now, "HH:MM:ss");
            var vm = {
                categories: cateRows,
                numBidTop: topDesc_numBids,
                priceTop: topDesc_price,
                poorTimeTop: topDesc_poorTime

            };
            res.render('index',vm);
    })

});

module.exports = r;