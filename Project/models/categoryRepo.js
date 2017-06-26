var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function() {
    var d = q.defer();
    var sql = 'select * from categories';
    d.resolve(db.load(sql));
    return d.promise;
};

exports.getName = function(cate_id){
    var d = q.defer();
    var sql = mustache.render('select* from categories where cate_id = {{cate_id}}',{cate_id:cate_id});
    d.resolve(db.load(sql));
    return d.promise;
}