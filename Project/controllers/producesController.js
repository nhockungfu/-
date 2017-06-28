var express = require('express'),
    multer = require('multer'),
    mustache = require('mustache'),
    fs = require('fs'),
    q = require('q'),
    moment = require('moment'),
    randomstring = require("randomstring"),
    path = require('path'),
    producesRepo = require('../models/producesRepo'),
    proimgRepo = require('../models/proimgRepo'),
    categoryRepo = require('../models/categoryRepo');


var r = express.Router();

r.get('/', function (req, res) {
    producesRepo.loadAll()
        .then(function (rows) {
            var vm = {
                layoutModels: res.locals.layoutModels,
                produces: rows
            };
            res.render('index', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });
});


r.get('/detail/:id', function (req, res) {
    var proId = req.params.id;
    if (!proId) {
        res.redirect('Lỗi không có dữ liệu');
    }
    producesRepo.getProInfoById(proId)
        .then(function (rows) {
            console.log(rows);
            var data = {
                dataInView: {
                    pro_id: rows[0].pro_id,
                    pro_name: rows[0].pro_name,
                    seller_id: rows[0].seller_id,
                    seller_email: (rows[0].seller_email),
                    seller_point: rows[0].seller_point,
                    start_time: rows[0].start_time,
                    end_time: rows[0].end_time,
                    highest_price: rows[0].highest_price,
                    purchase_price: rows[0].purchase_price,
                    bidder_id: rows[0].bidder_id,
                    bidder_email: function () {
                        return rows[0].bidder_email==rows[0].seller_email?'':maHoaEmail(rows[0].bidder_email);
                    },
                    bidder_point: function () {
                        return rows[0].bidder_email==rows[0].seller_email?'':rows[0].bidder_point;
                    },
                    days: tinhThoiGian(rows[0].total_time, 'd'),
                    hours: tinhThoiGian(rows[0].total_time, 'h'),
                    minutes: tinhThoiGian(rows[0].total_time, 'm'),
                    seconds: tinhThoiGian(rows[0].total_time, 's'),
                    img01: rows[0].img_path,
                    img02: rows[1].img_path,
                    img03: rows[2].img_path,
                }
            }
            var vm = {
                layoutModels: res.locals.layoutModels,
                layout:'main',
                product: data,
                status_name: 'Chi tiết sản phẩm'
            };

            res.render('produce/chiTiet', vm);

        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });
});


tinhThoiGian = function (sum_s, type){

    // 1 ngày = 86400 giây
    // 1 giờ = 3600 giây
    // 1 phút = 60 giây

    var result = 0;

    if(type == 'd'){
        result = sum_s/86400;
    }else if(type == 'h'){
        result = (sum_s % 86400)/3600;
    }else if(type == 'm'){
        result = ((sum_s % 86400)%3600)/60;
    }else if(type == 's'){
        result = (((sum_s % 86400)%3600)%60);
    }

    return checkTime(Math.floor(result));
}

checkTime = function (i){
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

maHoaEmail = function (email) {

    var index_of_At = email.indexOf("@");

    var email_string;
    if (index_of_At > 3) {
        email_string = 'xxx' + email.substring(index_of_At - 3);
    } else {
        email_string = 'xxx' + email.substring(0);
    }

    return email_string;
}
//----------------------------phan post bai dang----------------------------
r.get('/add', function (req, res) {
    res.render('produce/dangBai', {categories: res.locals.layoutModels});
});

var proId = randomstring.generate();
var storage = multer.diskStorage({
    //duong dan luu file
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync('./data/produces/' + proId);
        } catch (err) {
            if (err.code == 'EEXIST') {
                console.log('thu muc da ton tai');
            } else {
                console.log('Loi.....');
            }
        }
        cb(null, './data/produces/' + proId + '/')
    },
    //ten file luu
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname)
        console.log(file.fieldname)
        if (file.fieldname.toString().trim() === 'file1') {
            cb(null, '1' + ext)
        } else {
            if (file.fieldname.toString().trim() === 'file2') {
                cb(null, '2' + ext)
            } else {
                cb(null, '3' + ext)
            }
        }
    }
});

r.post('/add', multer({storage: storage}).any(), function (req, res, next) {
    console.log(req.body);
    var files = req.files;

    var entity = {
        name: req.body.txt_tenSp,
        start_price: req.body.txt_giaKd,
        purchase_price: req.body.txt_giaMn,
        highest_price: req.body.txt_giaKd,
        user_highest_price:res.locals.layoutModels.curUser.user_id,
        price_step: req.body.txt_bg,
        start_time: moment(req.body.txt_tgbd, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm'),
        end_time: moment(req.body.txt_tgkt, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm'),
        cate_id: req.body.cbb_select,
        seller_id: res.locals.layoutModels.curUser.user_id,
        num_bid: '0',
        auto: req.body.cb_tdgh ? 1 : 0
    }
    // fs.readFile('./data/produces/1/b.txt','utf8', function (err,data) {
    //     if (err) throw err;
    //     console.log(data);
    // });
    producesRepo.insert(entity).then(function (insertId) {
        if (fs.existsSync('./data/produces/' + proId)) {// kiem tra folder co ton tai hay khong
            fs.rename('./data/produces/' + proId, './data/produces/' + insertId, function (err) {
                console.log('Doi ten thanh cong');
            });
        } else {
            console.log('Folder khong ton tai');
            fs.mkdirSync('./data/produces/' + insertId);
        }

        //thuc hien dong thoi: them 3 file+cap nhat pro + them path img vao pro_img
        q.all([
            createMuiltyFile(insertId, req.body.txt_moTa),
            addMuiltyDataToProImg(files, insertId),
            producesRepo.updatePath({
                pro_id: insertId,
                describe_path: "./data/produces/" + insertId + "/desctibe.txt",
                bid_detail_path: './data/produces/' + insertId + '/bid_detail.txt',
                cmt_pro_path: './data/produces/' + insertId + '/cmt.txt'
            })
        ]).spread(function (rs1, rs2, rs3) {
            if (rs1 == 1 && rs2 == 1 && rs3 == 1)
                //res.render('welcome', {username: req.body.unm, password: req.body.pwd});
                res.redirect(mustache.render('/produces/detail/{{insertId}}',{insertId:insertId}));
        })
    }).fail(function (err) {
        console.log(err);
        ;
        res.end('fail');
    });

})

//ham tao 3 file desctibe, bid_detail,cmt
function createMuiltyFile(insertId, str) {
    var d = q.defer();
        fs.writeFile('./data/produces/' + insertId + '/desctibe.txt', str, 'utf8', function (err, data) {
            if (err) throw err;
        });
        fs.writeFile('./data/produces/' + insertId + '/bid_detail.txt', '', 'utf8', function (err, data) {
            if (err) throw err;
        });
        fs.writeFile('./data/produces/' + insertId + '/cmt.txt', '', 'utf8', function (err, data) {
            if (err) throw err;
        });
        d.resolve(1);
    return d.promise;
}

//ham them nhieu du lieu cung luc vao pro_img
function addMuiltyDataToProImg(files, insertId) {
    var d = q.defer();
    files.forEach(function (item) {
        proimgRepo.insert({
            pro_id: insertId,
            img_path: '/produces/' + insertId + '/' + item.filename
        })
    });
    d.resolve(1);
    return d.promise;
}
//----------------------------------------------------------------------------


module.exports = r;