var express = require('express');

var r = express.Router(),
    crypto = require('crypto');
    // restrict = require('../middle-wares/restrict');

var emailExistence = require('email-existence');

var account = require('../models/tuanRepo');
var userRepo = require('../models/userRepo');

// r.get('/', function (req,res) {
//    res.render('user/suaThongTinCaNhan', {layout: 'main', layoutModels: res.locals.layoutModels}) ;
// });
//
// r.post('/', function(req, res) {
//     var pass = crypto.createHash('md5').update(req.body.txt_password).digest('hex'),
//         passNew = crypto.createHash('md5').update(req.body.txt_passwordNew).digest('hex'),
//         passNew2 = crypto.createHash('md5').update(req.body.txt_passwordNew2).digest('hex'),
//         email = req.body.txt_email,
//         mailGoc = req.body.txt_mailTam;
//     var entity = {
//         email: req.body.txt_email,
//         name: req.body.txt_hoTen,
//         password: pass,
//         passwordNew: passNew,
//         passwordNew2: passNew2,
//         user_id: req.body.txt_id
//     };
//     var _res=res;
//     var layoutModels= res.locals.layoutModels;
//     account.checkAccountUpdate(entity).then(function (user) {
//         if(user == null){
//             _res.render('user/suaThongTinCaNhan', {
//                 layoutModels: layoutModels,
//                 layout:'main',
//                 showError: true
//             });
//         } else {
//             emailExistence.check(email, function(err,res){
//                 if(res){
//                     userRepo.loadDetail2(email).then(function (rows) {
//                         if(rows != null && email != mailGoc){
//                             _res.render('user/suaThongTinCaNhan',
//                                 {layoutModels: layoutModels,
//                                     layout:'main',
//                                     showError2: true});
//                         } else {
//                             account.update(entity).then(function (changedRows) {
//                                 _res.render('user/suaThongTinCaNhan',
//                                     {layoutModels: layoutModels,
//                                      layout:'main',
//                                      showError3: true});
//                             })
//                         }
//                     })
//                 } else {
//                     _res.render('user/suaThongTinCaNhan',
//                         {layoutModels: layoutModels,
//                             layout:'main',
//                             showError4: true});
//                 }
//             });
//         }
//     }).fail(function(err) {
//         console.log(err);
//         res.end('fail');
//     });
// });
//
// r.get('/success', function (req,res) {
//     res.render('successSignUp', {});
// });


module.exports = r;