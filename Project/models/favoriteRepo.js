var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.insert = function (entity) {
    var d = q.defer();
    var sql = mustache.render('select count(pro_id) as num from favorite_list WHERE user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
    db.load(sql).then(function (rows) {
        if(rows[0].num==0){
            var sql2=mustache.render('insert into favorite_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
            db.insert(sql2).then(function (insertId) {
                d.resolve(1);
            })
        }else{
            var sql2=mustache.render('delete from favorite_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
            db.insert(sql2).then(function (id) {
                d.resolve(0);
            })
        }
    })
    return d.promise;
}

exports.checkFav = function(entity){
    var d = q.defer();
    var sql = mustache.render('select count(pro_id) as num from favorite_list WHERE user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
    db.load(sql).then(function (rows) {
        d.resolve(rows[0].num);
    })
    return d.promise;
}
