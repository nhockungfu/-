var express = require('express');

var r = express.Router();

var account = require('../models/tuanRepo');

r.get('/',function (req,res) {
    var vm={};
    res.render('dangNhap',vm);
});

r.post('/', function(req, res) {

    var entity = {
        email: req.body.txtEmail,
        password: req.body.txtPassWord,
        point: 80
    };

    account.insert(entity)
        .then(function(insertId) {
            res.redirect("/tuan/success/");
        });
});

r.get('/success', function (req,res) {
    res.render('successSignUp', {});
});


module.exports = r;