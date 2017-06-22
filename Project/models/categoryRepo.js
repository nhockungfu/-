var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function() {
    var d = q.defer();
    var sql = 'select * from categories';
    d.resolve(db.load(sql));
    return d.promise;
};