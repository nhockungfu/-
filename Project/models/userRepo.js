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

exports.loadDetail2 = function (id) {
    var d = q.defer();
    var obj = {
        user_id: id
    };

    var sql = mustache.render(
        'select * from categories where cate_id = {{user_id}}',
        obj
    );

    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}
