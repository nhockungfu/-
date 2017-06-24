var express = require('express'),
    q = require('q'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    randomstring = require("randomstring"),
    userRepo = require('../models/userRepo'),
    categoryRepo = require('../models/categoryRepo');

var r = express.Router();

r.get('/',function (req,res) {
    categoryRepo.loadAll().then(function (rows) {
        res.render('dangBai',{categories:rows});
    })
});

var proId = randomstring.generate();
var storage = multer.diskStorage({
    //duong dan luu file
    destination: function (req,file,cb) {
        try{
            fs.mkdirSync('./data/users/'+proId);
        }catch(err) {
            if(err.code == 'EEXIST'){
                console.log('thu muc da ton tai');
            }else{
                console.log('Loi');
            }
        }

        cb(null,'./data/users/'+proId+'/')
    },
    //ten file luu
    filename: function (req,file,cb) {
        var ext = path.extname(file.originalname)
        console.log(file.fieldname)
        if(file.fieldname.toString().trim() === 'file1'){
            cb(null,'1'+ext)
        }else{
            if(file.fieldname.toString().trim() === 'file2'){
                cb(null,'2'+ext)
            }else{
                cb(null,'3'+ext)
            }
        }
    }
})



r.post('/',multer({storage:storage}).any(),function (req,res) {

    // var entity = {
    //     name:req.body.txt_tenSp,
    //     start_price:req.body.txt_giaKd,
    //     purchase_price:req.body.txt_giaKd,
    //     highest_price:req.body.txt_giaMn,
    //     price_step:req.body.txt_giaKd,
    //     start_time:
    //
    // }
    // proId=req.body.txt_tenSp;
    // try{
    //     var str = './data/users/'+proId;
    //     fs.mkdirSync('./data/users/'+proId);
    //     var upload = multer({storage:storage}).any()
    //     upload(req, res, function(err) {
    //         if(!err)
    //             console.log('Thanh coong');
    //
    //     })
    // }catch(err) {
    //     if(err.code == 'EEXIST'){
    //         console.log('thu muc da ton tai');
    //     }else{
    //         console.log('Loi');
    //     }
    // }

    console.log(proId);

})

module.exports = r;
