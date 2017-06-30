var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.loadAllByCate = function(cate_id,limit, offset,type) {
    var d = q.defer();
    var promises = [];

    var view = {
        cate_id: cate_id,
        limit: limit,
        offset: offset
    };
    var sqlCount = mustache.render('select  count(*) as total '+
        'from produces ' +
        'where produces.cate_id={{cate_id}} ',view)
    promises.push(db.load(sqlCount));
    var sql;
    if(type == 0){
        sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
            'from produces p, produce_imgs pi,user u,user u2 ' +
            'where p.cate_id={{cate_id}} and p.seller_id=u2.user_id and p.pro_id = pi.pro_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id limit {{limit}} offset {{offset}}',view);
    }else{
        if(type == 1){
            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
                'from produces p, produce_imgs pi,user u,user u2 ' +
                'where p.cate_id={{cate_id}} and p.seller_id=u2.user_id and p.pro_id = pi.pro_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id ORDER BY p.highest_price ASC limit {{limit}} offset {{offset}}',view);
        }else{

            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
                'from produces p, produce_imgs pi,user u,user u2 ' +
                'where p.cate_id={{cate_id}} and p.seller_id=u2.user_id and p.pro_id = pi.pro_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id ORDER BY (TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) DESC limit {{limit}} offset {{offset}}',view);
        }

    }


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

exports.searchPro = function(name,limit, offset,type) {
    var d = q.defer();
    var promises = [];

    var view = {
        name: name,
        limit: limit,
        offset: offset
    };
    var sqlCount = mustache.render('select  count(*) as total '+
        'from produces ' +
        'where pro_id and name like \'%{{{name}}}%\'',view)
    promises.push(db.load(sqlCount));
    var sql;
    if(type == 0){
        sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
            'from produces p, produce_imgs pi,user u,user u2 ' +
            'where p.name like \'%{{{name}}}%\' and p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price = u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id limit {{limit}} offset {{offset}}',view);
    }else{
        if(type == 1){
            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
                'from produces p, produce_imgs pi,user u,user u2 ' +
                'where p.name like \'%{{{name}}}%\' and p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price = u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id ORDER BY p.highest_price ASC limit {{limit}} offset {{offset}}',view);
        }
        else{
            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path,SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time ,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
                'from produces p, produce_imgs pi,user u,user u2 ' +
                'where p.name like \'%{{{name}}}%\' and p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price = u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time)>0 group by p.pro_id ORDER BY (TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) DESC limit {{limit}} offset {{offset}}',view);
        }
    }
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
        sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime from produces p, produce_imgs pi,user u, user u2 where p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);
    }
    else{
        if(assert == 'highest_price'){
            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path, SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime from produces p, produce_imgs pi,user u,user u2 where p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 GROUP BY p.pro_id ORDER BY {{As}} DESC LIMIT {{N}}', ref);

        }
        else{

            sql = mustache.render('select p.pro_id,p.name,p.highest_price,p.purchase_price,p.num_bid,u.email as email,u2.email as email_sell,pi.img_path, TIMESTAMPDIFF(SECOND,NOW(), p.end_time) AS secs, ' +
                'SEC_TO_TIME(TIMESTAMPDIFF(SECOND,NOW(), p.end_time)) AS total_time,TIMESTAMPDIFF(SECOND, p.start_time,NOW()) as ttime ' +
                'from produces p, produce_imgs pi,user u,user u2 ' +
                'where p.pro_id = pi.pro_id and p.seller_id=u2.user_id and p.user_highest_price=u.user_id and TIMESTAMPDIFF(SECOND,NOW(), p.end_time) > 0 ' +
                'GROUP BY p.pro_id ' +
                'ORDER BY secs ASC LIMIT {{N}}', ref);


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
        '(name,start_price,purchase_price,highest_price,user_highest_price,price_step,start_time,end_time,' +
        'cate_id,seller_id,num_bid,auto) values ' +
        '("{{{name}}}","{{start_price}}","{{purchase_price}}","{{highest_price}}","{{user_highest_price}}","{{price_step}}","{{start_time}}","{{end_time}}",' +
        '"{{cate_id}}","{{seller_id}}","{{num_bid}}","{{auto}}")',entity
    );
    db.insert(sql).then(function(insertId) {
        d.resolve(insertId);
    });
    return d.promise;
}

exports.updatePath=function (entity) {
    var d = q.defer();
    console.log(entity.describe_path);
    var sql = mustache.render(
        'update produces ' +
        'set describe_path = "{{{describe_path}}}",bid_detail_path = "{{{bid_detail_path}}}",cmt_pro_path = "{{{cmt_pro_path}}}" ' +
        'where pro_id ="{{pro_id}}"',entity
    );
    console.log(sql);
    var i=0;
    j=i+1;
    console.log(j);
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
        'select p.pro_id as pro_id,'+
                'p.name as pro_name,'+
                'seller.user_id as seller_id,'+
                'seller.email as seller_email,'+
                'seller.point as seller_point,'+
                'DATE_FORMAT(p.start_time, \'%d/%m/%Y %H:%m\') as start_time,'+
                'DATE_FORMAT(p.end_time, \'%d/%m/%Y %H:%m\') as end_time,'+
                'p.highest_price,'+
                'p.purchase_price, p.price_step,'+
                'bidder.user_id as bidder_id,'+
                'bidder.email as bidder_email,'+
                'bidder.point as bidder_point,'+
                'pi.img_path,'+
                'p.describe_path,'+
                'TIMESTAMPDIFF(SECOND,NOW(), p.end_time) AS total_time '+
        'from produces p, produce_imgs pi, user seller, user bidder '+
        'where p.pro_id = pi.pro_id and p.pro_id = {{pro_id}} and p.seller_id = seller.user_id and p.user_highest_price = bidder.user_id '
        , entity);

    d.resolve(db.load(sql));

return d.promise;
}

exports.checkPro=function (entity) {
    var d = q.defer();

    var sql = mustache.render('select count(pro_id) as num from produces WHERE pro_id="{{pro_id}}" and seller_id="{{user_id}}"',entity);
    db.load(sql).then(function (rows) {
        d.resolve(rows[0].num);
    })

    return d.promise;
}







