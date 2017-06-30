var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.insert = function (entity) {
    var d = q.defer();
    var sql = mustache.render('select count(pro_id) as num from produces where user_highest_price="{{user_id}}" and pro_id="{{pro_id}}"',entity);
    db.load(sql).then(function (rows) {
        if(rows[0].num==0){
            var sql2 = mustache.render('delete from detail_bid where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
            var sql3 = mustache.render('insert into kick_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
            console.log(sql2);
            console.log(sql3);
            q.all([db.insert(sql2),db.insert(sql3)]).spread(function (id1,id2) {
                d.resolve(id2);
            })
        }else{
            var sql2 = mustache.render('select user_id,price,pro_id from detail_bid where pro_id="{{pro_id}}" and user_id!="{{user_id}}" ORDER BY pro_id DESC LIMIT 1',entity);
            db.load(sql2).then(function (row) {
                var e1={
                    user_id:row[0].user_id,
                    price:row[0].price,
                    pro_id:row[0].pro_id
                }
                var sql3 = mustache.render('update produces set highest_price = "{{price}}",user_highest_price = "{{user_id}}" where pro_id ="{{pro_id}}"',e1);
                var sql4 = mustache.render('delete from detail_bid where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                var sql5 = mustache.render('insert into kick_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);

                console.log(sql3);
                console.log(sql4);
                console.log(sql5);

                q.all([db.insert(sql3),db.insert(sql4),db.insert(sql5)]).spread(function (id1,id2,id3) {
                    d.resolve(id3);
                })
            })
        }
    })
    return d.promise;
}

exports.checkKick = function(entity){
    var d = q.defer();
    var sql = mustache.render('select count(pro_id) as num from kick_list WHERE user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
    db.load(sql).then(function (rows) {
        d.resolve(rows[0].num);
    })
    return d.promise;
}