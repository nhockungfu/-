var Q = require('q'),
    categoryRepo = require('../models/categoryRepo');

module.exports = function(req, res, next) {
    if (req.session.isLogged === undefined) {
        req.session.isLogged = false;
    }

    Q.all([
        categoryRepo.loadAll()
    ]).spread(function(catList) {
        res.locals.layoutModels = {
            categories: catList,
            isLogged: req.session.isLogged,
            curUser: req.session.user,
        };
        next();
    });
};