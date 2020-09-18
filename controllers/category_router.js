const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category_model');

router.get('/index(/:pageindex/:pagesize)?', async (req, res) => {
    link = req.originalUrl;
    var tachchuoi = link.split('/');

    var page = req.params.pageindex;
    var limit = 5;//req.params.pagesize

    var start;

    if (page == undefined || page == 1) {
        start = 0;
        xetActive = 1;
    } else {
        start = (page - 1) * limit;
        xetActive = page;
    }

    //Tổng số danh mục
    let sumCategory = await categoryModel.find();
    //Tổng số trang
    let sumPage = Math.ceil(sumCategory.length / limit);

    // Về đầu trang
    var str = '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-double-left"></i></a></li>';

    // lùi 1 trang
    str += '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-left"></i></a></li>';

    for (let i = 1; i <= sumPage; i++) {

        var active = '';

        //Xét active
        if (xetActive == i) {
            active = 'active';
        }

        str += '<li class="page-item ' + active + '">';
        str += '<a class="page-link" href="category/index/' + i + '/' + limit + '">' + i + '</a></li>';
    }

    // Tiến 1 trang
    str += '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-right"></i></a></li>';

    // Về cuối trang
    str += '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-double-right"></i></a></li>';

    var main = 'categorys/main';

    categoryModel.
        find().
        sort({ '_id': -1 }).
        limit(limit).
        skip(start).
        exec(function (err, data) {
            if (err) throw err;
            res.render('index', { main: main, link: tachchuoi[1], data: data, url: '', str: str });
        });
});

router.get('/add', (req, res) => {
    var link = req.originalUrl;
    var tachchuoi = link.split('/');

    var main = 'categorys/add';
    res.render('index', { main: main, link: tachchuoi[1], url: 'add' });
});

router.post('/process_add', (req, res) => {
    var arr = {
        'name': req.body.name,
    }

    categoryModel.create(arr, function (err, data) {
        if (err) { return res.json({ kq: 0, errMsg: "Dữ liệu đã bị trùng" }) };
        res.json({ kq: 1 });
    });
});

router.get('/edit/:id', (req, res) => {
    var link = req.originalUrl;
    var tachchuoi = link.split('/');

    var main = 'categorys/edit';

    categoryModel.
        findById(req.params.id).
        exec(function (err, data) {
            if (err) throw err;
            res.render('index', { main: main, link: tachchuoi[1], data: data, url: 'edit/' + req.params.id });
        });
});

router.post('/process_edit/:id', (req, res) => {

    var arr = {
        'name': req.body.name,
    };

    categoryModel.updateMany({ _id: req.params.id }, arr, function (err, data) {
        if (err) { return res.json({ kq: 0, errMsg: "Dữ liệu đã bị trùng" }) };
        res.json({ kq: 2 });
    });
});

router.post('/delete', (req, res) => {
    categoryModel.findByIdAndDelete(req.body.id, function (err, data) {
        if (err) { return res.json({ kq: 0 }) };
        res.json({ kq: 1 });
    })
});

module.exports = router;