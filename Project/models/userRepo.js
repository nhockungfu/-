var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function() {
    var sql = 'select * from user';
    return db.load(sql);
}

exports.loadDetail = function (id) {
    var d = q.defer();
    var obj = {
        user_id: id
    };

    var sql = mustache.render(
        'select * from user where user_id = {{user_id}}',
        obj
    );

    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}
exports.loadDetail2 = function (email) {
    var d = q.defer();
    var obj = {
        email: email
    };

    var sql = mustache.render(
        'select * from user where email = "{{email}}"',
        obj
    );

    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}
exports.insert = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'insert into user (email,pass,point) values ("{{email}}","{{pass}}","{{point}}")',entity
    );
    db.insert(sql).then(function(insertId) {
        d.resolve(insertId);
    });
    return d.promise;
}
exports.checkAccount = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'select u.user_id,u.email,u.pass,u.name,u.phone,u.address,u.avt_path,u.point,u.sell_time,count(u.user_id) as sum ' +
        'from user u, voted_list vt ' +
        'where u.email = "{{email}}" and u.pass="{{pass}}" and u.user_id = vt.user_id',entity
    );
    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}