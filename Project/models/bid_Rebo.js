var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.insert = function (entity) {
    var d = q.defer();

    var sql=mustache.render('select price,user_id,count(pro_id) as sum from autobid_list where pro_id="{{pro_id}}"',entity);
    console.log(sql);

    db.load(sql).then(function (rows) {
        console.log('tong sum:')
        console.log(rows[0].sum);
        if(rows[0].sum==0){//chua co auto
            var sql2 = mustache.render(
                'update produces ' +
                'set highest_price = "{{price}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                'where pro_id ="{{pro_id}}"',entity);//cap nhat produces

            var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',entity);//them vao detail_bid


            q.all([db.insert(sql2),db.insert(sql3)]).spread(function (id1,id2) {
                var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                db.load(_sql).then(function (r) {
                    if(r[0].flag==0){
                        var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                        db.insert(_sql2);
                    }
                })
                d.resolve(0);
            })
        }
        else{//co auto roi
            if(entity.price>=rows[0].price){
                var sql2 = mustache.render(
                    'update produces ' +
                    'set highest_price = "{{price}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                    'where pro_id ="{{pro_id}}"',entity);
                var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                    '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',entity);//them vao detail_bid

                var sql4 = mustache.render('delete from autobid_list where pro_id="{{pro_id}}"',entity);

                console.log(sql2);
                console.log(sql3);

                q.all([db.insert(sql2),db.insert(sql3),db.insert(sql4)]).spread(function (id1,id2,id3) {
                    var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                    db.load(_sql).then(function (r) {
                        if(r[0].flag==0){
                            var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                            db.insert(_sql2);
                        }
                    })
                    d.resolve(1);
                })

            }else{
                var p=(parseInt(entity.price)+parseInt(entity.sprice));
                if(rows[0].price>p){
                    var sql_ = mustache.render('select user_email from detail_bid where pro_id="{{pro_id}}" and user_id="{{user_id}}"',{pro_id:entity.pro_id,user_id:rows[0].user_id});
                    db.load(sql_).then(function (row) {
                        var e1={
                            price:p,
                            user_id:rows[0].user_id,
                            pro_id:entity.pro_id
                        }
                        var sql2 = mustache.render(
                            'update produces ' +
                            'set highest_price = "{{price}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                            'where pro_id ="{{pro_id}}"',e1);//cap nhat lai produces

                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                            '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',entity);//them vao detail_bid

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:rows[0].user_id,
                            user_email:row[0].user_email,
                            price:p,
                            time:entity.time
                        }
                        var sql4 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                            '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',e2);//them vao detail_bid


                        q.all([db.insert(sql2),db.insert(sql3),db.insert(sql4)]).spread(function (id1,id2,id3) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {
                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(2);
                        })
                    })

                }
                else{
                    var sql_ = mustache.render('select user_email from detail_bid where pro_id="{{pro_id}}" and user_id="{{user_id}}"',{pro_id:entity.pro_id,user_id:rows[0].user_id});
                    db.load(sql_).then(function (row) {
                        var e1={
                            price:rows[0].price,
                            user_id:rows[0].user_id,
                            pro_id:entity.pro_id
                        }
                        var sql2 = mustache.render(
                            'update produces ' +
                            'set highest_price = "{{price}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                            'where pro_id ="{{pro_id}}"',e1);//cap nhat lai produces

                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                            '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',entity);//them vao detail_bid

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:rows[0].user_id,
                            user_email:row[0].user_email,
                            price:rows[0].price,
                            time:entity.time
                        }
                        var sql4 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                            '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{price}}","{{time}}")',e2);//them vao detail_bid

                        q.all([db.insert(sql2),db.insert(sql3),db.insert(sql4)]).spread(function (id1,id2,id3) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {
                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(3);
                        })
                    })
                }
            }
        }
    })
    return d.promise;
}