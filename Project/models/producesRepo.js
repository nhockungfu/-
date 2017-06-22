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