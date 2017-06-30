var express = require('express'),
    q = require('q'),
    producesRepo = require('../models/producesRepo'),
    restrict = require('../middle-wares/restrict');
var dateFormat = require('dateformat');

var r = express.Router();

r.get('/',function (req,res) {
    var date = new Date();

    var hour = date.getHours();

    q.all([
        producesRepo.loadTopNDesc('num_bid', 3),
        producesRepo.loadTopNDesc('highest_price', 3),
        producesRepo.loadTopNDesc('poor_time', 3)
    ]).spread(function (topDesc_numBids, topDesc_price, topDesc_poorTime) {

        console.log(topDesc_numBids);
        topDesc_numBids.forEach(function (item) {
            console.log(xuLyThoiGian(item.total_time ))

        })
        var vm = {
            numBidTop: topDesc_numBids,
            priceTop: topDesc_price,
            poorTimeTop: topDesc_poorTime,
            layoutModels: res.locals.layoutModels
        };
        res.render('index',vm);
    }).fail(function(err) {
        console.log(err);;
        res.end('fail');
    });
});

function xuLyThoiGian(str_time) {
    var l = str_time.length;

    t = (str_time).substr(0, l-6);
    n=parseInt(t/24);
    h=t%24;

    p = (str_time).substr(l-1-4, 2);
    g = (str_time).substr(l-1-1, 2);

    return n+' ngay '+g+':'+p+':'+g;
}
module.exports = r;

