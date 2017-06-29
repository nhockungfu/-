var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadAll = function () {
    var sql = 'select * from user';
    return db.load(sql);
}

exports.loadDetail = function (id) {
    var d = q.defer();
    var obj = {
        user_id: id
    };

    var sql = mustache.render(
        'select * from user where user_id = {{user_id}}',
        obj
    );

    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.loadDetail2 = function (email) {
    var d = q.defer();
    var obj = {
        email: email
    };

    var sql = mustache.render(
        'select * from user where email = "{{email}}"',
        obj
    );

    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.insert = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'insert into user (email,pass,point) values ("{{email}}","{{pass}}","{{point}}")', entity
    );
    db.insert(sql).then(function (insertId) {
        d.resolve(insertId);
    });
    return d.promise;
}
exports.checkAccount = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'select u.user_id,u.email,u.pass,u.name,u.phone,u.address,u.avt_path,u.point,u.sell_time,count(u.user_id) as sum ' +
        'from user u, voted_list vt ' +
        'where u.email = "{{email}}" and u.pass="{{pass}}" and u.user_id = vt.user_id', entity
    )
    ;
    console.log(sql);
    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.checkForWaitingChangePass = function (user_email) {
    var d = q.defer();

    var entity = {
        user_email: user_email,
    }

    var sql = mustache.render('SELECT waiting_for_change_pass FROM `user` where email = \'{{user_email}}\'', entity);
    console.log(sql);

    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    });

    return d.promise;
}

exports.changeUserPass = function (user_email, pass) {
    var d = q.defer();

    var entity = {
        user_email: user_email,
        pass: pass
    }

    var sql = mustache.render('UPDATE `user` SET pass = \'{{pass}}\' where email = \'{{user_email}}\'', entity);
    console.log(sql);

    d.resolve(db.load(sql));

    return d.promise;
}


exports.setNoneWaitingChangePass = function (user_email) {
    var d = q.defer();

    var entity = {
        user_email: user_email,
    }

    var sql = mustache.render('UPDATE `user` SET waiting_for_change_pass = 0 where email = \'{{user_email}}\'', entity);

    d.resolve(db.load(sql));
}

exports.update = function (entity) {
    if (entity) {
        var d = q.defer();

        var sql =
            mustache.render(
                'UPDATE user SET avt_path = "{{{avt}}}", name = "{{name}}",phone = "{{sdt}}",address = "{{{diaChi}}}" WHERE user_id = "{{user_id}}"', entity
            );

        db.update(sql).then(function (changedRows) {
            d.resolve(changedRows);
        });
        return d.promise;
    }
    return false;
}

exports.updatePass = function (entity) {
    if (entity) {
        var d = q.defer();

        var sql =
            mustache.render(
                'UPDATE user SET pass = "{{passNew}}" WHERE user_id = "{{user_id}}"', entity
            );

        db.update(sql).then(function (changedRows) {
            d.resolve(changedRows);
        });
        return d.promise;
    }
    return false;
}

exports.checkAccountUpdate = function (entity) {
    var d = q.defer();
    var sql = mustache.render(
        'select * from user where user_id = "{{user_id}}" and pass="{{password}}"', entity
    );
    db.load(sql).then(function (rows) {
        d.resolve(rows[0]);
    });
    return d.promise;
}

exports.getBiddingListForUser = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id
    }

    var sql = mustache.render(
        'SELECT p.pro_id, p.`name`, p.purchase_price, p.highest_price, u2.email bidder_email FROM bidding_list bl,`user` u, produces p, `user` u2 WHERE bl.user_id = u.user_id and u.user_id = {{user_id}} and bl.pro_id = p.pro_id and p.user_highest_price = u2.user_id and TIMESTAMPDIFF(SECOND, NOW(), p.end_time) > 0', entity
    );

    d.resolve(db.load(sql));

    return d.promise;
}

exports.getFavoriteListForUser = function (user_id) {
    var d = q.defer();

    var entity = {
        user_id: user_id
    }

    var sql = mustache.render(
        'SELECT p.pro_id, p.`name`, p.purchase_price, p.highest_price, u2.email AS bidder_email FROM favorite_list fl,`user` u, produces p, `user` u2 WHERE fl.user_id = u.user_id and u.user_id = {{user_id}} and fl.pro_id = p.pro_id and p.user_highest_price = u2.user_id', entity
    );

    d.resolve(db.load(sql));

    return d.promise;
}

exports.getBidHistorForUser = function (user_id, user_email) {
    var d = q.defer();

    var entity = {
        user_id: user_id,
        user_mail: user_email
    }

    var sql = mustache.render(
        'SELECT p.pro_id, p.`name`, p.purchase_price, p.highest_price,if(u2.email = \'{{user_mail}}\', \'Thành công\', \'Thất bại\') as result FROM bidding_list bl,`user` u, produces p, `user` u2 WHERE bl.user_id = u.user_id and u.user_id = {{user_id}} and bl.pro_id = p.pro_id and p.user_highest_price = u2.user_id', entity
    );

    d.resolve(db.load(sql));

    return d.promise;
}