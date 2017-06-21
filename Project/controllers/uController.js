var express = require('express'),
    q = require('q'),
    userRepo = require('../models/userRepo');

var r = express.Router();

r.get('/',function (req,res) {
    // userRepo.loadDetail(1).then(function (us) {
    //     var vm = {
    //         layout: false,
    //         user: us
    //     };
    //     res.render('thongTinCaNhan',vm);
    // });
    // var u,vt
    // userRepo.loadDetail(1).then(function (us) {
    //     u:us;
    //
    // });
    // userRepo.loadDetail2(1).then(function (v) {
    //     console.log(v);
    // });
    // console.log(u);

    // q.all([userRepo.loadDetail(1),userRepo.loadDetail2(1)]).spread(function (a,b) {
    //         var vm = {
    //             layout: false,
    //             user: a,
    //             v:b
    //         };
    //         res.render('thongTinCaNhan',vm);
    // })
    var vm={};
    res.render('index',vm);
});

module.exports = r;
