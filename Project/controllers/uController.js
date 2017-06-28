var express = require('express'),
    crypto = require('crypto'),
    emailExistence = require('email-existence'),
    fs = require('fs'),
    userRepo = require('../models/userRepo'),
    restrict = require('../middle-wares/restrict'),
    categoryRepo = require('../models/categoryRepo'),
    produceRepo = require('../models/producesRepo');

var r = express.Router();

r.get('/dangky',function (req,res) {
    res.render('user/dangKy',{layout:'main',layoutModels: res.locals.layoutModels,showError:false});
});

r.post('/dangky',function (req,res) {
    var email = req.body.txtEmail,
        pass = crypto.createHash('md5').update(req.body.txtPassWord).digest('hex');
    var user={
        email: email,
        pass: pass,
        point:0
    }
    var _res=res;
    var layoutModels= res.locals.layoutModels;
    emailExistence.check(email, function(err,res){
        if(res){
            userRepo.loadDetail2(email).then(function (rows) {
                if(rows != null){
                    console.log('co trong csdl roi')
                    _res.render('user/dangKy',
                        {layoutModels: layoutModels,
                            layout:'main',
                            showError:true});
                }else{
                    console.log('chua co trong csdl')
                    userRepo.insert(user).then(function (insertId) {
                        _res.render('user/dangKyThanhCong',
                                {layoutModels: layoutModels,
                                email:email,
                                layout:false});
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
            _res.render('user/dangKy',
                {layoutModels: layoutModels,
                    layout:'main',
                    showError:true});
        }
    });
});

r.get('/dangnhap',function (req,res) {
    if (req.session.isLogged === true) {
        res.redirect('/home');
    } else {
        res.render('user/dangNhap2', {
            layout:'main',
            layoutModels: res.locals.layoutModels,
            showError: false,
        });
    }
});

r.post('/dangnhap',function (req,res) {
    var email = req.body.txt_email,
        pass = crypto.createHash('md5').update(req.body.txt_pass).digest('hex');

    var entity={
        email:email,
        pass:pass
    };
    var f=false;
    userRepo.checkAccount(entity).then(function (user) {
        if (user == null) {
            console.log('dang nhap that bai')
            res.render('user/dangNhap2', {
                layoutModels: res.locals.layoutModels,
                layout:'main',
                showError: true
            });
        } else {
            console.log(user.sum);
            console.log(user.point);
            console.log(user.point/user.sum*100);
                if(user.sum==0)
                    f=true;
                if(user.point/user.sum*100>=80){

                    f=true;
                }
            console.log('isBid = '+f);

            console.log('dang nhap thanh cong')
            req.session.isLogged = true;
            req.session.user = user;
            req.session.isBid=f;

            var url = '/home';
            if (req.query.retUrl) {
                url = req.query.retUrl;
            }
            res.redirect(url);
        }
    }).fail(function(err) {
        console.log(err);;
        res.end('fail');
    });
});

r.post('/dangxuat', restrict, function(req, res) {
    req.session.isLogged = false;
    req.session.isBid = false;
    req.session.user = null;
    req.session.cookie.expires = new Date(Date.now() - 1000);
    res.redirect(req.headers.referer);
});
module.exports = r;
