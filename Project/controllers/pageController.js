var express = require('express'),
    q = require('q'),
    producesRepo = require('../models/producesRepo'),
    restrict = require('../middle-wares/restrict');
var dateFormat = require('dateformat');

var r = express.Router();

r.get('/',function (req,res) {
    q.all([
        producesRepo.loadTopNDesc('num_bid', 3),
        producesRepo.loadTopNDesc('highest_price', 3),
        producesRepo.loadTopNDesc('poor_time', 3)
    ]).spread(function (topDesc_numBids, topDesc_price, topDesc_poorTime) {
        var now = new Date();
        dateFormat(now, "HH:MM:ss");
            var vm = {
                numBidTop: topDesc_numBids,
                priceTop: topDesc_price,
                poorTimeTop: topDesc_poorTime,
                layoutModels: res.locals.layoutModels
            };
            res.render('index',vm);
    })
});


module.exports = r;

