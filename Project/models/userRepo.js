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
        'select * from user where email = "{{email}}" and pass="{{pass}}"',entity
    );
    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.updateFull = function (entity) {
    if(entity){
        var d = q.defer();

        var sql =
            mustache.render(
                'UPDATE user SET pass = "{{passwordNew}}",name = "{{name}}",email = "{{email}}" WHERE user_id = "{{user_id}}"', entity
            );

        db.update(sql).then(function(changedRows) {
            d.resolve(changedRows);
        });
        return d.promise;
    }
    return false;
}

exports.update = function (entity) {
    if(entity){
        var d = q.defer();

        var sql =
            mustache.render(
                'UPDATE user SET name = "{{name}}",email = "{{email}}",phone = "{{sdt}}",address = "{{diaChi}}" WHERE user_id = "{{user_id}}"', entity
            );

        db.update(sql).then(function(changedRows) {
            d.resolve(changedRows);
        });
        return d.promise;
    }
    return false;
}

exports.checkAccountUpdate = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'select * from user where user_id = "{{user_id}}" and pass="{{password}}"',entity
    );
    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}