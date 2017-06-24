var db = require('../fn/db'),
    mustache = require('mustache'),
    q = require('q');

exports.insert = function (entity) {
    var d = q.defer();

    var sql = mustache.render(
        'insert into produce_imgs ' +
        '(pro_id,img_path) values ' +
        '("{{pro_id}}","{{img_path}}")',entity
    );
    db.insert(sql).then(function() {
        d.resolve(1);
    });
    return d.promise;
}

exports.loadAll = function () {
    var d = q.defer();
    var sql = 'select * from produce_imgs';
    d.resolve(db.load(sql)) ;
    return d.promise;
}