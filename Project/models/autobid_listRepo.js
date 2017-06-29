var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.insert = function (entity) {
    var d = q.defer();

    var sql0 = mustache.render('select count(pro_id) as num,price,user_id from autobid_list where pro_id="{{pro_id}}"',entity);
    db.load(sql0).then(function (rows) {

        console.log(rows[0].num)
        if(rows[0].num==0){//chua co du lieu
            var sql1 = mustache.render('insert into autobid_list (user_id,pro_id,price) values ' +
                '("{{user_id}}","{{pro_id}}","{{price}}")',entity);//them vao autobid
            var sql2 = mustache.render(
                'update produces ' +
                'set highest_price = "{{hprice}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                'where pro_id ="{{pro_id}}"',entity);//cap nhat vao produces
            var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ' +
                '("{{pro_id}}","{{user_id}}","{{{user_email}}}","{{hprice}}","{{time}}")',entity);//them vao detail_bid

            q.all([db.insert(sql1),db.insert(sql2),db.insert(sql3)]).spread(function (id1,id2,id3) {
                var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                db.load(_sql).then(function (r) {
                    console.log('gia tri R:')
                    console.log(r);
                    if(r[0].flag==0){
                        var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                        db.insert(_sql2);
                    }
                })
                d.resolve(0);
            })
        }else{//da co nguoi dat gia auto truoc
            if(rows[0].price>entity.price){//auto vo sau be hon
                var p=(parseInt(entity.price)+parseInt(entity.sprice));
                var e1={highest_price:p,pro_id:entity.pro_id,user_id:rows[0].user_id};
                var e3={highest_price:rows[0].price,pro_id:entity.pro_id,user_id:rows[0].user_id};
                var sql = mustache.render('select user_email from detail_bid where pro_id="{{pro_id}}" and user_id="{{user_id}}"',e1);

                db.load(sql).then(function (row) {
                    if(rows[0].price>p){
                        var sql1 = mustache.render('update produces set highest_price = "{{highest_price}}",num_bid=num_bid + 1 where pro_id = "{{pro_id}}"',e1);//cap nhat vao produces

                        var sql2 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ("{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',entity);//them vao detail_bid

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:e1.user_id,
                            user_email:row[0].user_email,
                            price:p,
                            time:entity.time,
                        }
                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values (' +
                            '"{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',e2);//them vao detail_bid co auto

                        q.all([db.insert(sql1),db.insert(sql2),db.insert(sql3)]).spread(function (id1,id2,id3) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {
                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(1);
                        })
                    }
                    else{
                        var sql1 = mustache.render('update produces set highest_price = "{{highest_price}}",num_bid=num_bid + 1 where pro_id = "{{pro_id}}"',e3);//cap nhat vao produces

                        var sql2 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ("{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',entity);//them vao detail_bid

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:e1.user_id,
                            user_email:row[0].user_email,
                            price:e3.highest_price,
                            time:entity.time,
                        }
                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values (' +
                            '"{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',e2);//them vao detail_bid co auto

                        q.all([db.insert(sql1),db.insert(sql2),db.insert(sql3)]).spread(function (id1,id2,id3) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {
                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(2);
                        })
                    }
                })

            }
            else{//auto vao sau lon hon
                var p=(parseInt(rows[0].price)+parseInt(entity.sprice));
                var sql = mustache.render('select user_email from detail_bid where pro_id="{{pro_id}}" and user_id="{{user_id}}"',{pro_id:entity.pro_id,user_id:rows[0].user_id});
                db.load(sql).then(function (row) {
                    if(parseInt(entity.price)>p){
                        var e1={
                            hprice:p,
                            user_id:entity.user_id,
                            pro_id:entity.pro_id
                        }
                        var sql1 = mustache.render(
                            'update produces ' +
                            'set highest_price = "{{hprice}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                            'where pro_id ="{{pro_id}}"',e1);//cap nhat vao produces
                        var e4={
                            user_id:entity.user_id,
                            price:entity.price,
                            pro_id:entity.pro_id
                        }
                        var sql4 = mustache.render('update autobid_list set user_id="{{user_id}}",price={{price}} where pro_id="{{pro_id}}"',e4);//cap nhat auto

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:rows[0].user_id,
                            user_email:row[0].user_email,
                            price:rows[0].price,
                            time:entity.time
                        }
                        var sql2 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ("{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',e2);//them vao detail_bid

                        var e3={
                            pro_id:entity.pro_id,
                            user_id:entity.user_id,
                            user_email:entity.user_email,
                            price:p,
                            time:entity.time,
                        }
                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values (' +
                            '"{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',e3);//them vao detail_bid co auto
                        console.log(sql1);
                        console.log(sql4);
                        console.log(sql2);
                        console.log(sql3);
                        q.all([db.insert(sql1),db.insert(sql2),db.insert(sql3),db.insert(sql4)]).spread(function (id1,id2,id3,id4) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {

                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(3);
                        })
                    }
                    else{
                        var e1={
                            hprice:entity.price,
                            user_id:entity.user_id,
                            pro_id:entity.pro_id
                        }
                        var sql1 = mustache.render(
                            'update produces ' +
                            'set highest_price = "{{hprice}}",user_highest_price = "{{user_id}}",num_bid=num_bid + 1 ' +
                            'where pro_id ="{{pro_id}}"',e1);//cap nhat vao produces
                        var e4={
                            user_id:entity.user_id,
                            price:entity.price,
                            pro_id:entity.pro_id
                        }
                        var sql4 = mustache.render('update autobid_list set user_id="{{user_id}}",price="{{price}}" where pro_id="{{pro_id}}"',e4);//cap nhat auto

                        var e2={
                            pro_id:entity.pro_id,
                            user_id:rows[0].user_id,
                            user_email:row[0].user_email,
                            price:rows[0].price,
                            time:entity.time
                        }
                        var sql2 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values ("{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',e2);//them vao detail_bid

                        var sql3 = mustache.render('insert into detail_bid (pro_id,user_id,user_email,price,time) values (' +
                            '"{{pro_id}}","{{user_id}}","{{user_email}}","{{price}}","{{time}}")',entity);//them vao detail_bid co auto

                        q.all([db.insert(sql1),db.insert(sql2),db.insert(sql3),db.insert(sql4)]).spread(function (id1,id2,id3,id4) {
                            var _sql=mustache.render('select count(user_id) as flag from bidding_list where user_id="{{user_id}}" and pro_id="{{pro_id}}"',entity);
                            db.load(_sql).then(function (r) {
                                if(r[0].flag==0){
                                    var _sql2=mustache.render('insert into bidding_list (user_id,pro_id) values ("{{user_id}}","{{pro_id}}")',entity);
                                    db.insert(_sql2);
                                }
                            })
                            d.resolve(4);
                        })
                    }
                })
            }
        }
    })
    return d.promise;
}



