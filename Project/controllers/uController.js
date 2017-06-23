var express = require('express'),
    q = require('q'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    userRepo = require('../models/userRepo');

var r = express.Router();

r.get('/',function (req,res) {

            res.render('dangBai',{});
});


var storage = multer.diskStorage({
    //duong dan luu file
    destination: function (req,file,cb) {
        try{
            fs.mkdirSync('./data/users/6');
            console.log('tao thanh cong')
        }catch(err) {
            if(err.code == 'EEXIST'){
                console.log('thu muc da ton tai');
            }else{
                console.log('Loi nhieu vl');
            }
        }
        cb(null,'./data/users/6/')
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



r.post('/',function (req,res) {
    var upload = multer({storage:storage}).any()
    upload(req, res, function(err) {
        console.log('Thanh coong ahihi');
    })

})

module.exports = r;
