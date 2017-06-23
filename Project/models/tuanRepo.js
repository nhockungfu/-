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