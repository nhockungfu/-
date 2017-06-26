var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.loadAllByCate = function(cate_id,limit, offset) {
    var d = q.defer();
    var promises = [];

    var view = {
        cate_id: cate_id,
        limit: limit,
        offset: offset
    };
    var sqlCount = mustache.render('select  count(*) as total '+
        'from produces, produce_imgs ' +
        'where produces.pro_id = produce_imgs.pro_id and produces.cate_id={{cate_id}}',view)
    promises.push(db.load(sqlCount));
    var sql = mustache.render('select *,(TIMESTAMPDIFF(SECOND,NOW(), produces.end_time)) AS total_time ' +
        'from produces, produce_imgs ' +
        'where produces.cate_id={{cate_id}} and produces.pro_id = produce_imgs.pro_id limit {{limit}} offset {{offset}}',view);

    promises.push(db.load(sql));
    q.all(promises).spread(function(totalRow, rows) {
        var data = {
            total: totalRow[0].total,
            list: rows
        }
        d.resolve(data);
    });
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
        sql = mustache.render('select *, (TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);
    }
    else{
        if(assert == 'highest_price'){
            sql = mustache.render('select *, (TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);
        sql = mustache.render('select *, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ' +
            'from produces p, produce_imgs pi where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 ' +
            'GROUP BY p.pro_id ' +
            'ORDER BY {{As}} DESC LIMIT {{N}}', ref);
    }
    else{
        if(assert == 'highest_price'){
            sql = mustache.render('select *, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ' +
                'from produces p, produce_imgs pi ' +
                'where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 ' +
                'GROUP BY p.pro_id ' +
                'ORDER BY {{As}} DESC LIMIT {{N}}', ref);
        }
        else{
            if(assert == 'poor_time'){
                sql = mustache.render('select *, TIMESTAMPDIFF(SECOND,NOW(), p.end_time) AS secs, ' +
                    'SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ' +
                    'from produces p, produce_imgs pi ' +
                    'where p.pro_id = pi.pro_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 ' +
                    'GROUP BY p.pro_id ' +
                    'ORDER BY secs ASC LIMIT {{N}}', ref);
            }
        }
    }
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

exports.getProInfoById = function(id){
    var d = q.defer();

    var entity = {
      pro_id: id
    };

    var sql = mustache.render(
        'select p.pro_id,'+
            'p.name as pro_name,'+
            'seller.user_id as seller_id,'+
            'seller.email as seller_email,'+
            'seller.point as seller_point,'+
            'DATE_FORMAT(p.start_time, \'%d/%m/%Y %h:%m %p\') as start_time,'+
            'DATE_FORMAT(p.end_time, \'%d/%m/%Y %h:%m %p\') as end_time,'+
            'p.highest_price,'+
            'p.purchase_price,'+
            'bidder.user_id as bidder_id,'+
            'bidder.email as bidder_email,'+
            'bidder.point as bidder_point,'+
            'TIMESTAMPDIFF(SECOND,NOW(), p.end_time) AS total_time '+
            'from produces p, produce_imgs pi, user seller, user bidder '+
            'where p.pro_id = pi.pro_id and p.pro_id = {{pro_id}} and p.seller_id = seller.user_id and p.user_highest_price = bidder.user_id '+
            'GROUP BY p.pro_id', entity);

    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}