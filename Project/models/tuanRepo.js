var Q = require('q');

var mustache = require('mustache');

var db = require('../fn/db');

exports.insert = function(entity) {
    if(entity){
        var deferred = Q.defer();

        var sql =
            mustache.render(
                'insert into user (email, pass, point) values ("{{email}}", "{{password}}", {{point}})',
                entity
            );

        db.insert(sql).then(function(insertId) {
            deferred.resolve(insertId);
        });
        return deferred.promise;
    }
    return false;
}

exports.update = function (entity) {
    if(entity){
        var deferred = Q.defer();

        var sql =
            mustache.render(
                'UPDATE user SET pass = "{{passwordNew}}",name = "{{name}}",email = "{{email}}" WHERE user_id = "{{user_id}}"', entity
            );

        db.update(sql).then(function(changedRows) {
            deferred.resolve(changedRows);
        });
        return deferred.promise;
    }
    return false;
}

exports.checkAccountUpdate = function (entity) {
    var d = Q.defer();
    var sql = mustache.render(
        'select * from user where user_id = "{{user_id}}" and pass="{{password}}"',entity
    );
    db.load(sql).then(function(rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}