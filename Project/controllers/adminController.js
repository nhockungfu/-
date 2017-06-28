var express = require('express'),
    q = require('q'),
    nodemailer = require('nodemailer'),
    adminRepo = require('../models/adminRepo');


var r = express.Router();

r.get('/', function (req, res) {

    var vm = {
        layout: 'admin'
    }

    res.render('admin02/home', vm);

})

r.get('/mgs-for-sell', function (req, res) {
    adminRepo.getListMessage()
        .then(function (rows) {

            console.log(rows);

            var vm = {
                layout: 'admin',
                listMessage: rows
            }

            res.render('admin02/message-for-sell', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });
});

r.get('/users-mngt', function (req, res) {
    adminRepo.getListUser()
        .then(function (rows) {

            var vm = {
                layout: 'admin',
                users: rows
            }

            res.render('admin02/users-management', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });
});

r.get('/cate-list', function (req, res) {
    adminRepo.getCateList()
        .then(function (rows) {

            console.log(rows);

            var vm = {
                layout: 'admin',
                categories: rows
            }

            res.render('admin02/category-list', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });
});

r.post('/action-categories', function (req, res) {

    var action_type = req.body.txtAction;
    var cate_id = req.body.txtCateId;
    var cate_name = req.body.txtCateName;

    if (action_type == 'add') {
        adminRepo.addCate(cate_name);
    } else if (action_type == 'delete') {
        adminRepo.deleteCate(cate_id);
    } else if (action_type == 'edit') {
        adminRepo.updateCate(cate_id, cate_name);
    }


    console.log(req.body.txtAction);
    console.log(req.body.txtCateId);
    console.log(req.body.txtCateName);

    adminRepo.getCateList()
        .then(function (rows) {

            console.log(rows);

            var vm = {
                layout: 'admin',
                categories: rows,
            }

            res.render('admin02/category-list', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });

});

r.post('/action-user', function (req, res) {

    var action_type = req.body.txtAction;
    var user_id = req.body.txtUserId;

    if (action_type == 'delete') {
        adminRepo.deleteUser(user_id);
    } else if (action_type == 'reset-pass') {
        adminRepo.getUserMail(user_id).then(function(email_result){

            var user_email = email_result.email;

            var transporter =  nodemailer.createTransport({ //cấu hình mail server
                service: 'Gmail',
                auth: {
                    user: 'dever.group.sp@gmail.com',
                    pass: 'dever123'
                }
            });

            var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: 'Dever Group',
                to: 'vsp1308@gmail.com',
                subject: 'Xác nhận đổi mật khẩu',
                text: 'You recieved message from Vòng Say Phu',
                html: '<h3>Xin chào bạn!</h3><p><b><a href="http://localhost:3000/home">DevGroup</a></b> gửi bạn mail xác nhận reset lại mật khẩu của tài khoản đã đăng ký:</p><ul><li>Để xác nhận hành động này: Vui lòng click vào <a href="http://localhost:3000/user/reset-pass/'+user_email+'">đường dẫn này</a>.</li><li>Không xác nhận: Vui lòng không làm gì cả.</li></ul>'
            }

            transporter.sendMail(mainOptions, function(err, info){
                if (err) {
                    console.log(err);
                    res.end('Lỗi gửi mail...');
                } else {
                    console.log('Message sent: ' +  info.response);
                    res.end('Đặt lại mật khẩu');
                }
            });

            adminRepo.setWaitingChangePass(user_id);
        })
    }

    adminRepo.getListUser()
        .then(function (rows) {

            var vm = {
                layout: 'admin',
                users: rows
            }

            res.render('admin02/users-management', vm);
        }).fail(function (err) {
        console.log(err);
        res.end('fail');
    });

});



module.exports = r;