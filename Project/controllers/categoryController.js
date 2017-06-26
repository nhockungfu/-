var express = require('express'),
    categoryRepo = require('../models/categoryRepo'),
    producesRepo = require('../models/producesRepo'),
    q = require('q');

var r = express.Router();

r.get('/danhmuc/:id',function (req,res) {
    var rec_per_page = 9;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
    var name;
    categoryRepo.getName(req.params.id).then(function (row) {
        console.log(row[0].name);
        name=row[0].name;
    })
    producesRepo.loadAllByCate(req.params.id, rec_per_page, offset)
        .then(function(data) {

            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: function () {
                        return i==curPage;
                    }
                });
            }

            res.render('category/dsSanPham', {
                layoutModels: res.locals.layoutModels,
                produces: data.list,
                isEmpty: data.total === 0,
                cateName: name,
                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
            });
        });

})

r.post('/timkiem',function (req,res) {
    var rec_per_page = 9;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
    var name=req.body.txt_timKiem;

    producesRepo.searchPro(name,rec_per_page, offset)
        .then(function(data) {

            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: function () {
                        return i==curPage;
                    }
                });
            }

            res.render('category/dsSanPham', {
                layoutModels: res.locals.layoutModels,
                produces: data.list,
                isEmpty: data.total === 0,
                cateName: 'Tìm kiếm: '+ name,
                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
            });
        });
})
module.exports = r;
