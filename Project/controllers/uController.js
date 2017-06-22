var express = require('express'),
    q = require('q'),
    multer = require('multer'),
    fs = require('fs'),
    userRepo = require('../models/userRepo');

var r = express.Router();

r.get('/',function (req,res) {

            res.render('dangBai',{
                path:'/images/postImgBg.png'
            });
});


var storage = multer.diskStorage({
    //duong dan luu file
    destination: function (req,file,cb) {
        try{
            fs.mkdirSync('./data/users/'+req.body.txt_tenSp);
            console.log('tao thanh cong')
        }catch(err) {
            if(err.code == 'EEXIST'){
                console.log('thu muc da ton tai');
            }else{
                console.log('Loi nhieu vl');
            }
        }
        cb(null,'./data/users/'+req.body.txt_tenSp+'/')
    },
    //ten file luu
    filename: function (req,file,cb) {
        cb(null,file.originalname)
    }
})

var upload = multer({storage:storage})

r.post('/',upload.single('file1'),function (req,res) {
    console.log(req.file.destination);
})

module.exports = r;
