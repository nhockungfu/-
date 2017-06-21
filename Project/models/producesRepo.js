var db = require('../fn/db');

exports.loadAll = function() {
    var sql = 'select * from produces, produce_imgs where produces.pro_id = produce_imgs.pro_id';
    return db.load(sql);
};