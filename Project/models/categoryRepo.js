var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function() {
    var d = q.defer();
    var sql = 'select * from categories';
    return db.load(sql);
}