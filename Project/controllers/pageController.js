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
    emailExistence.check(email, function(err,res){
        if(res){
            userRepo.loadDetail2(email).then(function (rows) {
                if(rows != null){
                    console.log('co trong csdl roi')
                }else{
                    console.log('chua co trong csdl')
                    userRepo.insert(user).then(function (insertId) {
                        console.log('them thanh cong ' + insertId);
                    }).fail(function(err) {
                        console.log(err);;
                        res.end('fail');
                    });
                }
            })
            console.log('co thuc');
        }else{
            console.log('Khong co thuc');
        }
    });
})

r.get('/dangnhap',function (req,res) {
    res.render('dangNhap2',{});
});

r.post('/dangnhap',function (req,res) {
    var email = req.body.txt_email,
        pass = crypto.createHash('md5').update(req.body.txt_pass).digest('hex');

    var entity={
        email:email,
        pass:pass
    };

    userRepo.checkAccount(entity).then(function (row) {
        if(row!=null){
            res.send('dang nhap thanh cong');
            console.log('dang nhap thanh cong');
        }else{
            res.send('dang nhap that bai');
            console.log('dang nhap that bai');
        }
    }).fail(function(err) {
        console.log(err);;
        res.end('fail');
    });
})
module.exports = r;

