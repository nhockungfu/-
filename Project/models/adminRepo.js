var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.getListMessage = function () {
    var d = q.defer();

    var sql = 'SELECT u.user_id, u.`name`, u.email, req.reason_for_sell, DATE_FORMAT(req.send_time, \'%m/%d/%Y\') as send_time FROM `user` u, sell_request_list req where u.user_id = req.user_id and (u.`status` <> 0 AND u.`status` <> 3) ORDER BY send_time ASC';
    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}

exports.getListUser = function () {
    var d = q.defer();

    var sql = 'SELECT user_id, avt_path, `name`, email, phone, point FROM `user` WHERE (`status` = 1 OR `status` = 2)';

    d.resolve(db.load(sql));

    return d.promise;
}

exports.getCateList = function () {
    var d = q.defer();

    var sql = 'SELECT * FROM categories WHERE status = 1';

    d.resolve(db.load(sql));

    return d.promise;
}

exports.deleteCate = function (cate_id) {
    var d = q.defer();

    var entity = {
        cate_id: cate_id
    }

    var sql = mustache.render('UPDATE categories SET `status` = 0 where cate_id = {{cate_id}}', entity);

    d.resolve(db.load(sql));

    return d.promise;
}

exports.addCate = function (cate_name) {
    var d = q.defer();

    var entity = {
        cate_name: cate_name
    }

    var sql = mustache.render('INSERT INTO categories (`name`) VALUES(\'{{cate_name}}\')', entity);

    d.resolve(db.load(sql));

    return d.promise;
}

exports.updateCate = function (cate_id, cate_name) {
    var d = q.defer();

    var entity = {
        cate_id: cate_id,
        cate_name: cate_name
    }

    var sql = mustache.render('UPDATE categories SET `name` = \'{{cate_name}}\' where cate_id = {{cate_id}}', entity);

    d.resolve(db.load(sql));

    return d.promise;
}

exports.deleteUser = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id,
    }

    var sql = mustache.render('UPDATE `user` SET `status` = 0 where user_id = {{user_id}}', entity);

    d.resolve(db.load(sql));

    return d.promise;
}

exports.getUserMail = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id,
    }

    var sql = mustache.render('SELECT email FROM `user` where user_id = {{user_id}} and (`status` <> 0 OR `status` <> 3)', entity);
    console.log(sql);

    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    })

    return d.promise;
}

exports.setWaitingChangePass = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id,
    }

    var sql = mustache.render('UPDATE `user` SET waiting_for_change_pass = 1 where user_id = \'{{user_id}}\'', entity);
    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}

//sửa quyền của user
exports.updateUserStatus = function (user_id, status_val) {
    var d = q.defer();

    var entity = {
        status: status_val,
        user_id: user_id
    }

    var sql = mustache.render('UPDATE `user` SET status = {{status}} where user_id = \'{{user_id}}\'', entity);
    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}

// xóa dòng dữ liệu trong bảng xin được bán
exports.deleteMessageForSell = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id
    }

    var sql = mustache.render('DELETE FROM sell_request_list WHERE user_id = {{user_id}}', entity);
    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}

//đếm số lượng sản phẩm đã sử dụng category này
exports.countNumCateUsed = function (cate_id) {
    var d = q.defer();

    var entity = {
        cate_id: cate_id
    }

    var sql = mustache.render('SELECT COUNT(*) AS num_used FROM produces where cate_id = {{cate_id}}', entity);
    console.log(sql);

    db.load(sql).then(function(rows){
        d.resolve(rows[0]);
    })

    return d.promise;
}