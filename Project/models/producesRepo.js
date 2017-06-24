var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.loadAll = function() {
    var d = q.defer();
    var sql = 'select * from produces, produce_imgs where produces.pro_id = produce_imgs.pro_id';
    d.resolve(db.load(sql)) ;
    return d.promise;
};

exports.loadTopNDesc = function(assert, n) {

    var d = q.defer();
    var ref = {
        N: n,
        As: assert

    };

    var sql;
    if(assert == 'num_bid'){
        sql = mustache.render('select *, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);
    }
    else{
        if(assert == 'highest_price'){
            sql = mustache.render('select *, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);
        }
        else{
            if(assert == 'poor_time'){
                sql = mustache.render('select *, TIMESTAMPDIFF(SECOND,NOW(), p.end_time) AS secs, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY secs ASC LIMIT {{N}}', ref);
            }
        }
    }
    console.log(sql);
    d.resolve(db.load(sql));
    return d.promise;
};

//phan nay chuyen qua produce
exports.insert = function (entity) {
    var d = q.defer();

    var sql = mustache.render(
        'insert into produces ' +
        '(name,start_price,purchase_price,highest_price,price_step,start_time,end_time,' +
        'cate_id,seller_id,num_bid,auto) values ' +
        '("{{name}}","{{start_price}}","{{purchase_price}}","{{highest_price}}","{{price_step}}","{{start_time}}","{{end_time}}",' +
        '"{{cate_id}}","{{seller_id}}","{{num_bid}}","{{auto}}")',entity
    );
    db.insert(sql).then(function(insertId) {
        d.resolve(insertId);
    });
    return d.promise;
}

exports.updatePath=function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'update produces ' +
        'set describe_path = "{{describe_path}}",bid_detail_path = "{{bid_detail_path}}",cmt_pro_path = "{{cmt_pro_path}}" ' +
        'where pro_id ="{{pro_id}}"',entity
    );
    db.insert(sql).then(function() {
        d.resolve(1);
    });
    return d.promise;
}