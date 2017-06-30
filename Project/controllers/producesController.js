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
    categoryRepo = require('../models/categoryRepo'),
    detail_bidRepo = require('../models/detail_bidRebo'),
    auto_listRepo = require('../models/autobid_listRepo'),
    bid_Repo = require('../models/bid_Rebo'),
    favoriteRebo = require('../models/favoriteRepo'),
    nodemailer = require('nodemailer'),
    kich_userRepo = require('../models/kich_userRepo');


var r = express.Router();

r.get('/detail/:id', function (req, res) {
    var proId = req.params.id;

    if (!proId) {
        res.redirect('Lỗi không có dữ liệu');
    }

    q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
        var sprice = rows[0].price_step;
        var hprice = rows[0].highest_price;
        var data = {
            pro_id: rows[0].pro_id,
            pro_name: rows[0].pro_name,
            seller_id: rows[0].seller_id,
            seller_email: (rows[0].seller_email),
            seller_point: rows[0].seller_point,
            start_time: rows[0].start_time,
            end_time: rows[0].end_time,
            highest_price: rows[0].highest_price,
            purchase_price: rows[0].purchase_price,
            sprice: sprice,
            des_path: rows[0].describe_path,
            price_step: rows[0].price_step,
            bidder_id: rows[0].bidder_id,
            describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
            bidder_email: function () {
                return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
            },
            bidder_point: function () {
                return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
            },
            days: tinhThoiGian(rows[0].total_time, 'd'),
            hours: tinhThoiGian(rows[0].total_time, 'h'),
            minutes: tinhThoiGian(rows[0].total_time, 'm'),
            seconds: tinhThoiGian(rows[0].total_time, 's'),
            img01: rows[0].img_path,
            img02: rows[1].img_path,
            img03: rows[2].img_path
        };

        if (res.locals.layoutModels.isLogged) {
            var fv = false, fk = false, fss = false;
            var ee = {
                pro_id: proId,
                user_id: res.locals.layoutModels.curUser.user_id
            }
            q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                fv = num1 == 0 ? false : true;
                fk = num2 == 0 ? false : true;
                fss = num3 == 0 ? false : true;
                var vm = {
                    layoutModels: res.locals.layoutModels,
                    layout: 'main',
                    sprice: sprice,
                    hprice: hprice,
                    product: data,
                    total_time: rows[0].total_time,
                    f_fav: fv,
                    f_kick: fk,
                    f_sell: fss,
                    detail_bid: detail_bid,
                    status_name: 'Chi tiết sản phẩm',
                };
                res.render('produce/chiTiet', vm);
            })
        } else {
            var fv = false, fk = false, fss = false;
            var vm = {
                layoutModels: res.locals.layoutModels,
                layout: 'main',
                sprice: sprice,
                hprice: hprice,
                product: data,
                total_time: rows[0].total_time,
                f_fav: fv,
                f_kick: fk,
                f_sell: fss,
                detail_bid: detail_bid,
                status_name: 'Chi tiết sản phẩm',
            };
            res.render('produce/chiTiet', vm);
        }
    });

}).fail(function (err) {
    console.log(err);
    res.end('fail');
});

r.post('/detail', function (req, res) {

    var kich_user = req.body.txt_kich_user_id;
    if (kich_user != '') {
        var proId = req.body.txt_pro_id;
        var entity = {
            user_id: kich_user,
            pro_id: proId,
        }
        kich_userRepo.insert(entity).then(function (result) {
            q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
                var hprice = rows[0].highest_price;
                var sprice = rows[0].price_step;
                var data = {
                    pro_id: rows[0].pro_id,
                    pro_name: rows[0].pro_name,
                    seller_id: rows[0].seller_id,
                    seller_email: (rows[0].seller_email),
                    seller_point: rows[0].seller_point,
                    start_time: rows[0].start_time,
                    end_time: rows[0].end_time,
                    highest_price: rows[0].highest_price,
                    sprice: sprice,
                    des_path: rows[0].describe_path,
                    purchase_price: rows[0].purchase_price,
                    price_step: rows[0].price_step,
                    bidder_id: rows[0].bidder_id,
                    describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
                    bidder_email: function () {
                        return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
                    },
                    bidder_point: function () {
                        return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
                    },
                    days: tinhThoiGian(rows[0].total_time, 'd'),
                    hours: tinhThoiGian(rows[0].total_time, 'h'),
                    minutes: tinhThoiGian(rows[0].total_time, 'm'),
                    seconds: tinhThoiGian(rows[0].total_time, 's'),
                    img01: rows[0].img_path,
                    img02: rows[1].img_path,
                    img03: rows[2].img_path
                }
                if (res.locals.layoutModels.isLogged) {
                    var fv = false, fk = false, fss = false;
                    var ee = {
                        pro_id: proId,
                        user_id: res.locals.layoutModels.curUser.user_id
                    }
                    q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                        fv = num1 == 0 ? false : true;
                        fk = num2 == 0 ? false : true;
                        fss = num3 == 0 ? false : true;
                        var vm = {
                            layoutModels: res.locals.layoutModels,
                            layout: 'main',
                            sprice: sprice,
                            hprice: hprice,
                            product: data,
                            total_time: rows[0].total_time,
                            f_fav: fv,
                            f_kick: fk,
                            f_sell: fss,
                            detail_bid: detail_bid,
                            status_name: 'Chi tiết sản phẩm',
                        };
                        res.render('produce/chiTiet', vm);
                    })
                } else {
                    var fv = false, fk = false, fss = false;
                    var vm = {
                        layoutModels: res.locals.layoutModels,
                        layout: 'main',
                        sprice: sprice,
                        hprice: hprice,
                        product: data,
                        total_time: rows[0].total_time,
                        f_fav: fv,
                        f_kick: fk,
                        f_sell: fss,
                        detail_bid: detail_bid,
                        status_name: 'Chi tiết sản phẩm',
                    };
                    res.render('produce/chiTiet', vm);
                }
            })
        })
    }
    else {

        if (req.body.btn_dg == 'btn_dg') {
            var proId = req.body.txt_pro_id;
            var entity = {
                pro_id: proId,
                user_id: res.locals.layoutModels.curUser.user_id,
                user_email: maHoaEmail(res.locals.layoutModels.curUser.email),
                price: req.body.txt_gia,
                sprice: parseInt(req.body.txt_sprice, 10),
                time: taoChuoiNgay(),
            }

            bid_Repo.insert(entity).then(function (result) {

                if (result == 0 || result == 1) {//chua co auto or gia cao hon auto
                    guiMail(res.locals.layoutModels.curUser.email, 'Chúc mừng bạn đã đặt giá thành công mức giá '
                        + req.body.txt_gia + 'đ cho sản phẩm ' + req.body.txt_pro_name + '. Hãy tiếp tục theo dõi đấu giá...');

                }
                if (result == 2 || result == 3) {

                }
                q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
                    var sprice = rows[0].price_step;
                    var hprice = rows[0].highest_price;
                    var data = {
                        pro_id: rows[0].pro_id,
                        pro_name: rows[0].pro_name,
                        seller_id: rows[0].seller_id,
                        seller_email: (rows[0].seller_email),
                        seller_point: rows[0].seller_point,
                        start_time: rows[0].start_time,
                        end_time: rows[0].end_time,
                        highest_price: rows[0].highest_price,
                        sprice: sprice,
                        des_path: rows[0].describe_path,
                        purchase_price: rows[0].purchase_price,
                        price_step: rows[0].price_step,
                        bidder_id: rows[0].bidder_id,
                        describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
                        bidder_email: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
                        },
                        bidder_point: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
                        },
                        days: tinhThoiGian(rows[0].total_time, 'd'),
                        hours: tinhThoiGian(rows[0].total_time, 'h'),
                        minutes: tinhThoiGian(rows[0].total_time, 'm'),
                        seconds: tinhThoiGian(rows[0].total_time, 's'),
                        img01: rows[0].img_path,
                        img02: rows[1].img_path,
                        img03: rows[2].img_path
                    }
                    if (res.locals.layoutModels.isLogged) {
                        var fv = false, fk = false, fss = false;
                        var ee = {
                            pro_id: proId,
                            user_id: res.locals.layoutModels.curUser.user_id
                        }
                        q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                            fv = num1 == 0 ? false : true;
                            fk = num2 == 0 ? false : true;
                            fss = num3 == 0 ? false : true;
                            var vm = {
                                layoutModels: res.locals.layoutModels,
                                layout: 'main',
                                sprice: sprice,
                                hprice: hprice,
                                product: data,
                                total_time: rows[0].total_time,
                                f_fav: fv,
                                f_kick: fk,
                                f_sell: fss,
                                detail_bid: detail_bid,
                                status_name: 'Chi tiết sản phẩm',
                            };
                            res.render('produce/chiTiet', vm);
                        })
                    } else {
                        var fv = false, fk = false, fss = false;
                        var vm = {
                            layoutModels: res.locals.layoutModels,
                            layout: 'main',
                            sprice: sprice,
                            hprice: hprice,
                            product: data,
                            total_time: rows[0].total_time,
                            f_fav: fv,
                            f_kick: fk,
                            f_sell: fss,
                            detail_bid: detail_bid,
                            status_name: 'Chi tiết sản phẩm',
                        };
                        res.render('produce/chiTiet', vm);
                    }
                })
            });
        }
        if (req.body.btn_dg == 'btn_dgtudong') {
            var proId = req.body.txt_pro_id;
            var entity = {
                pro_id: proId,
                user_id: res.locals.layoutModels.curUser.user_id,
                user_email: maHoaEmail(res.locals.layoutModels.curUser.email),
                price: req.body.txt_gia,
                hprice: parseInt(req.body.txt_hprice, 10) + parseInt(req.body.txt_sprice, 10),
                sprice: parseInt(req.body.txt_sprice, 10),
                time: taoChuoiNgay(),
            }
            auto_listRepo.insert(entity).then(function (result) {
                if (result == 3 || result == 4) {//chua co auto or gia cao hon auto
                    guiMail(res.locals.layoutModels.curUser.email, 'Chúc mừng bạn đã đặt giá Tự động thành công mức giá '
                        + req.body.txt_gia + 'đ cho sản phẩm ' + req.body.txt_pro_name + '. Hãy tiếp tục theo dõi đấu giá...');
                }
                if (result == 0 || result == 1 || result == 2) {

                }
                q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
                    var hprice = rows[0].highest_price;
                    var sprice = rows[0].price_step;
                    var data = {
                        pro_id: rows[0].pro_id,
                        pro_name: rows[0].pro_name,
                        seller_id: rows[0].seller_id,
                        seller_email: (rows[0].seller_email),
                        seller_point: rows[0].seller_point,
                        start_time: rows[0].start_time,
                        end_time: rows[0].end_time,
                        highest_price: rows[0].highest_price,
                        sprice: sprice,
                        des_path: rows[0].describe_path,
                        purchase_price: rows[0].purchase_price,
                        price_step: rows[0].price_step,
                        bidder_id: rows[0].bidder_id,
                        describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
                        bidder_email: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
                        },
                        bidder_point: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
                        },
                        days: tinhThoiGian(rows[0].total_time, 'd'),
                        hours: tinhThoiGian(rows[0].total_time, 'h'),
                        minutes: tinhThoiGian(rows[0].total_time, 'm'),
                        seconds: tinhThoiGian(rows[0].total_time, 's'),
                        img01: rows[0].img_path,
                        img02: rows[1].img_path,
                        img03: rows[2].img_path
                    }
                    if (res.locals.layoutModels.isLogged) {
                        var fv = false, fk = false, fss = false;
                        var ee = {
                            pro_id: proId,
                            user_id: res.locals.layoutModels.curUser.user_id
                        }
                        q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                            fv = num1 == 0 ? false : true;
                            fk = num2 == 0 ? false : true;
                            fss = num3 == 0 ? false : true;
                            var vm = {
                                layoutModels: res.locals.layoutModels,
                                layout: 'main',
                                sprice: sprice,
                                hprice: hprice,
                                product: data,
                                total_time: rows[0].total_time,
                                f_fav: fv,
                                f_kick: fk,
                                f_sell: fss,
                                detail_bid: detail_bid,
                                status_name: 'Chi tiết sản phẩm',
                            };
                            res.render('produce/chiTiet', vm);
                        })
                    } else {
                        var fv = false, fk = false, fss = false;
                        var vm = {
                            layoutModels: res.locals.layoutModels,
                            layout: 'main',
                            sprice: sprice,
                            hprice: hprice,
                            product: data,
                            total_time: rows[0].total_time,
                            f_fav: fv,
                            f_kick: fk,
                            f_sell: fss,
                            detail_bid: detail_bid,
                            status_name: 'Chi tiết sản phẩm',
                        };
                        res.render('produce/chiTiet', vm);
                    }
                })
            })
        }
        if (req.body.btn_dg == 'btn_yeuthich') {
            var proId = req.body.txt_pro_id;
            var entity = {
                user_id: res.locals.layoutModels.curUser.user_id,
                pro_id: proId,
            }
            favoriteRebo.insert(entity).then(function (result) {
                if (result == 0) {//xoa yeu thich
                    console.log('xoa yeu thich')
                } else {//them yeu thich
                    console.log('them yeu thich')
                }
                q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
                    var hprice = rows[0].highest_price;
                    var sprice = rows[0].price_step;
                    var data = {
                        pro_id: rows[0].pro_id,
                        pro_name: rows[0].pro_name,
                        seller_id: rows[0].seller_id,
                        seller_email: (rows[0].seller_email),
                        seller_point: rows[0].seller_point,
                        start_time: rows[0].start_time,
                        end_time: rows[0].end_time,
                        highest_price: rows[0].highest_price,
                        sprice: sprice,
                        des_path: rows[0].describe_path,
                        purchase_price: rows[0].purchase_price,
                        price_step: rows[0].price_step,
                        bidder_id: rows[0].bidder_id,
                        describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
                        bidder_email: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
                        },
                        bidder_point: function () {
                            return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
                        },
                        days: tinhThoiGian(rows[0].total_time, 'd'),
                        hours: tinhThoiGian(rows[0].total_time, 'h'),
                        minutes: tinhThoiGian(rows[0].total_time, 'm'),
                        seconds: tinhThoiGian(rows[0].total_time, 's'),
                        img01: rows[0].img_path,
                        img02: rows[1].img_path,
                        img03: rows[2].img_path
                    }
                    if (res.locals.layoutModels.isLogged) {
                        var fv = false, fk = false, fss = false;
                        var ee = {
                            pro_id: proId,
                            user_id: res.locals.layoutModels.curUser.user_id
                        }
                        q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                            fv = num1 == 0 ? false : true;
                            fk = num2 == 0 ? false : true;
                            fss = num3 == 0 ? false : true;
                            var vm = {
                                layoutModels: res.locals.layoutModels,
                                layout: 'main',
                                sprice: sprice,
                                hprice: hprice,
                                product: data,
                                total_time: rows[0].total_time,
                                f_fav: fv,
                                f_kick: fk,
                                f_sell: fss,
                                detail_bid: detail_bid,
                                status_name: 'Chi tiết sản phẩm',
                            };
                            res.render('produce/chiTiet', vm);
                        })
                    } else {
                        var fv = false, fk = false, fss = false;
                        var vm = {
                            layoutModels: res.locals.layoutModels,
                            layout: 'main',
                            sprice: sprice,
                            hprice: hprice,
                            product: data,
                            total_time: rows[0].total_time,
                            f_fav: fv,
                            f_kick: fk,
                            f_sell: fss,
                            detail_bid: detail_bid,
                            status_name: 'Chi tiết sản phẩm',
                        };
                        res.render('produce/chiTiet', vm);
                    }
                })
            })
        }
    }

})

r.post('/addDes', function (req, res) {
    var day = new Date();
    var str_day = '<br><span style="color: #ff0000;background-color: #00ffff;">Cập nhật (' + day.getDate() + '/' + day.getMonth() + '/' + day.getFullYear() + ' ' + day.getHours() + ':' + day.getMinutes() + ')</span><br>' + req.body.txt_moTa;
    fs.appendFile(req.body.txt_des_path, str_day, function (err) {
        if (err) throw err;
        var proId = req.body.txt_des_pro;
        q.all([producesRepo.getProInfoById(proId), detail_bidRepo.loadAll(proId)]).spread(function (rows, detail_bid) {
            var sprice = rows[0].price_step;
            var hprice = rows[0].highest_price;
            var data = {
                pro_id: rows[0].pro_id,
                pro_name: rows[0].pro_name,
                seller_id: rows[0].seller_id,
                seller_email: (rows[0].seller_email),
                seller_point: rows[0].seller_point,
                start_time: rows[0].start_time,
                end_time: rows[0].end_time,
                highest_price: rows[0].highest_price,
                purchase_price: rows[0].purchase_price,
                sprice: sprice,
                des_path: rows[0].describe_path,
                price_step: rows[0].price_step,
                bidder_id: rows[0].bidder_id,
                describe: fs.readFileSync(rows[0].describe_path, 'utf8'),
                bidder_email: function () {
                    return rows[0].bidder_email == rows[0].seller_email ? '' : maHoaEmail(rows[0].bidder_email);
                },
                bidder_point: function () {
                    return rows[0].bidder_email == rows[0].seller_email ? '' : rows[0].bidder_point;
                },
                days: tinhThoiGian(rows[0].total_time, 'd'),
                hours: tinhThoiGian(rows[0].total_time, 'h'),
                minutes: tinhThoiGian(rows[0].total_time, 'm'),
                seconds: tinhThoiGian(rows[0].total_time, 's'),
                img01: rows[0].img_path,
                img02: rows[1].img_path,
                img03: rows[2].img_path
            }
            if (res.locals.layoutModels.isLogged) {
                var fv = false, fk = false, fss = false;
                var ee = {
                    pro_id: proId,
                    user_id: res.locals.layoutModels.curUser.user_id
                }
                q.all([favoriteRebo.checkFav(ee), kich_userRepo.checkKick(ee), producesRepo.checkPro(ee)]).spread(function (num1, num2, num3) {
                    fv = num1 == 0 ? false : true;
                    fk = num2 == 0 ? false : true;
                    fss = num3 == 0 ? false : true;
                    var vm = {
                        layoutModels: res.locals.layoutModels,
                        layout: 'main',
                        sprice: sprice,
                        hprice: hprice,
                        product: data,
                        total_time: rows[0].total_time,
                        f_fav: fv,
                        f_kick: fk,
                        f_sell: fss,
                        detail_bid: detail_bid,
                        status_name: 'Chi tiết sản phẩm',
                    };
                    res.render('produce/chiTiet', vm);
                })
            } else {
                var fv = false, fk = false, fss = false;
                var vm = {
                    layoutModels: res.locals.layoutModels,
                    layout: 'main',
                    sprice: sprice,
                    hprice: hprice,
                    product: data,
                    total_time: rows[0].total_time,
                    f_fav: fv,
                    f_kick: fk,
                    f_sell: fss,
                    detail_bid: detail_bid,
                    status_name: 'Chi tiết sản phẩm',
                };
                res.render('produce/chiTiet', vm);
            }
        })
    });

})
guiMail = function (email, noidung) {
    var transporter = nodemailer.createTransport({ //cấu hình mail server
        service: 'Gmail',
        auth: {
            user: 'dever.group.sp@gmail.com',
            pass: 'dever123'
        }
    });

    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Dever Group',
        to: email,
        subject: 'Thông báo quá trình đấu giá',
        text: ' ',
        html: noidung
    }

    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log('khong gui dc mail');
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}
taoChuoiNgay = function () {
    var day = new Date();
    var str_day = day.getDate() + '/' + day.getMonth() + '/' + day.getFullYear() + ' ' + day.getHours() + ':' + day.getMinutes();
    return moment(str_day, 'D/M/YYYY hh:mm').format('YYYY-MM-DDTHH:mm');
}
tinhThoiGian = function (sum_s, type) {

    // 1 ngày = 86400 giây
    // 1 giờ = 3600 giây
    // 1 phút = 60 giây

    var result = 0;

    if (type == 'd') {
        result = sum_s / 86400;
    } else if (type == 'h') {
        result = (sum_s % 86400) / 3600;
    } else if (type == 'm') {
        result = ((sum_s % 86400) % 3600) / 60;
    } else if (type == 's') {
        result = (((sum_s % 86400) % 3600) % 60);
    }

    return checkTime(Math.floor(result));
}

checkTime = function (i) {
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
var sizef = 0;
r.post('/add', multer({storage: storage}).any(), function (req, res, next) {

    var files = req.files;
    files.forEach(function () {
        sizef++;
    });
    if (sizef < 3) {
        sizef = 0;
        res.send('chua chon du 3 anh');
    } else {
        sizef = 0;
        var day = new Date();

        var str_day = day.getHours() + ':' + day.getMinutes();
        var entity = {
            name: req.body.txt_tenSp,
            start_price: req.body.txt_giaKd,
            purchase_price: req.body.txt_giaMn,
            highest_price: req.body.txt_giaKd,
            user_highest_price: res.locals.layoutModels.curUser.user_id,
            price_step: req.body.txt_bg,
            start_time: moment(req.body.txt_tgbd + ' ' + str_day, 'D/M/YYYY hh:mm').format('YYYY-MM-DDTHH:mm'),
            end_time: moment(req.body.txt_tgkt + ' ' + str_day, 'D/M/YYYY hh:mm').format('YYYY-MM-DDTHH:mm'),
            cate_id: req.body.cbb_select,
            seller_id: res.locals.layoutModels.curUser.user_id,
            num_bid: '0',
            auto: req.body.cb_tdgh ? 1 : 0
        }

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
                    res.redirect(mustache.render('/produces/detail/{{insertId}}', {insertId: insertId}));
            })
        }).fail(function (err) {
            console.log(err);
            ;
            res.end('fail');
        });
    }
})

//ham tao 3 file desctibe, bid_detail,cmt
function createMuiltyFile(insertId, str) {
    var d = q.defer();
    fs.writeFile('./data/produces/' + insertId + '/desctibe.txt', str, 'utf8', function (err, data) {
        if (err) throw err;
    });
    // fs.writeFile('./data/produces/' + insertId + '/bid_detail.txt', '', 'utf8', function (err, data) {
    //     if (err) throw err;
    // });
    // fs.writeFile('./data/produces/' + insertId + '/cmt.txt', '', 'utf8', function (err, data) {
    //     if (err) throw err;
    // });
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