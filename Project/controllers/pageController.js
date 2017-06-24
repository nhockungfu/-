var express = require('express'),
    q = require('q'),
    emailExistence = require('email-existence'),
    crypto = require('crypto'),
    userRepo = require('../models/userRepo'),
    categoryRepo = require('../models/categoryRepo'),
    producesRepo = require('../models/producesRepo');

var dateFormat = require('dateformat');

var r = express.Router();

r.get('/',function (req,res) {
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

r.get('/dangky',function (req,res) {
    res.render('dangKy',{});
})

r.post('/dangky',function (req,res) {
    var email = req.body.txtEmail,
        pass = crypto.createHash('md5').update(req.body.txtPassWord).digest('hex');
    var user={
        email: email,
        pass: pass,
        point:0
    }
    var check = false;
    emailExistence.check(email, function(err,res){
        if(res){
            userRepo.loadDetail2(email).then(function (rows) {
                if(rows != null){
                    check = true;
                    console.log('co trong csdl roi')
                }
            })
        }else{
            check=true;
            console.log('Khong co thuc');
        }
    });
    if(!check){
        userRepo.insert(user).then(function (insertId) {
            console.log('them thanh cong' + insertId);
            res.send('them thanh cong');
        }).fail(function(err) {
            console.log(err);;
            res.end('fail');
        });
    }
})

module.exports = r;