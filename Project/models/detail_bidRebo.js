var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.loadAll = function (proId) {
    var d = q.defer();
    var sql = mustache.render('select price,user_id,user_email,DATE_FORMAT(time, \'%d/%m/%Y %H:%m\') as time from detail_bid where pro_id="{{proId}}" ORDER BY price DESC',{proId:proId});
    d.resolve(db.load(sql));
    return d.promise;
}
exports.insert = function (entity) {
    var d = q.defer();
    var sql = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
        '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',entity);
    db.insert(sql).then(function(insertId) {
        d.resolve(insertId);
    });
    return d.promise;
}
