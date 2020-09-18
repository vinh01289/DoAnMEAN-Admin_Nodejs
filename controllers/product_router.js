const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const router = express.Router();
router.use(bodyparser.urlencoded({ extended: false }));

const multer = require('multer');

const productModel = require('../models/books_model');
const categoryModel = require('../models/category_model');

router.get('/index(/:pageindex/:pagesize)?', async (req, res) => {
    var link = req.originalUrl;
    var tachchuoi = link.split('/');

    var s = req.query.s;

    var page = req.params.pageindex;
    var limit = 3;//req.params.pagesize

    var start;

    if (page == undefined || page == 1) {
        start = 0;
        xetActive = 1;
    } else {
        start = (page - 1) * limit;
        xetActive = page;
    }

    //Tổng số sản phẩm 
    let sumProduct = await productModel.find();
    //Tổng số trang
    let sumPage = Math.ceil(sumProduct.length / limit);

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
        str += '<a class="page-link" href="product/index/' + i + '/' + limit + '">' + i + '</a></li>';
    }

    // Tiến 1 trang
    str += '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-right"></i></a></li>';

    // Về cuối trang
    str += '<li class="page-item">';
    str += '<a class="page-link" href="#">';
    str += '<i class="fa fa-angle-double-right"></i></a></li>';

    // console.log(sumpage);

    var main = 'products/main';

    // thông tin bảng sản phẩm
    productModel.
        find(). //or([{ name: {$regex:'.*'+s+'.*'} }, { content: {$regex:'.*'+s+'.*'} }]).
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

    //Lấy danh mục sản phẩm
    categoryModel.find().exec(function (err, data) {
        if (err) throw err;

        var main = 'products/add';
        res.render('index', { main: main, link: tachchuoi[1], url: 'add', category: data });
    });
});

// Cấu hình lưu file
const storage = multer.diskStorage({
    // đường dẫn lưu file
    destination: (req, file, cb)=>{
        cb(null, 'uploads');
    },
    // cấu hình file
    filename: (req, file, cb)=>{
        // 1 tấm ảnh úp lên server cần xét 3 cái
        //--- 1. file đó có tồn tại trên server chưa?
        //--- 2. kiểm tra đuôi file
        //--- 3. kiểm tra kích thước file
            // uploads ảnh lên
            cb(null, Date.now() + '-' + file.originalname);
            //console.log(file);
    }
});
// Giới hạn kích thước file
var limits = { fileSize: 1024 * 200 }; 

// Gọi ra sử dụng
const uploads = multer({ storage: storage, limits: limits }).single('image');

router.post('/process_add', (req, res) => {

    uploads(req, res, function (err) {
        // kiểm tra kích thước file
         if(err instanceof multer.MulterError){
             res.send(err);
        }else if(err){
            res.send(err);
        }else{
            //  res.send('ok');
        }
    });

    var arr = {
        'name': req.body.name,
        'content': req.body.content,
        'id_category': req.body.id_category,
        'image': req.body.image
    }
    console.log(req.body.image);
    productModel.create(arr, function (err, data) {
        if (err) { return res.json({ kq: 0, errMsg: "Dữ liệu đã bị trùng" }) };
        res.json({ kq: 1 });
    });

});

router.get('/edit/:id', (req, res) => {
    var link = req.originalUrl;
    var tachchuoi = link.split('/');

    var main = 'products/edit';

    productModel.
        findById(req.params.id).
        exec(function (err, data) {
            if (err) throw err;

            res.render('index', { main: main, link: tachchuoi[1], data: data, url: 'edit/' + req.params.id });
        });
});

router.post('/process_edit/:id', (req, res) => {

    var arr = {
        'name': req.body.name,
        'content': req.body.content
    };

    productModel.updateMany({ _id: req.params.id }, arr, function (err, data) {
        if (err) { return res.json({ kq: 0, errMsg: "Dữ liệu đã bị trùng" }) };
        res.json({ kq: 2 });
    });

});

router.post('/delete', (req, res) => {
    productModel.findByIdAndDelete(req.body.id, function (err, data) {
        if (err) { return res.json({ kq: 0 }) };
        res.json({ kq: 1 });
    })
});

module.exports = router;