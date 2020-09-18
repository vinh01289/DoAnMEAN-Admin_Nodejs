const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category_model');

router.get('/', (req, res) => {
     
    // obj = [
    //     {
    //         name: 'dien thoai'
    //     },
    //     {
    //         name: 'tui xach'
    //     },
    //     {
    //         name: 'giay dep'
    //     }
    // ];
    // categoryModel.create(obj, function(err, data){
    //     if(err){
    //         res.json({kq:0, err:err})
    //     }else{
    //         res.json({kq:1, data:data})
    //     }
    // });


    categoryModel.find().exec(function (err, data) {
        if (err) {
            res.json({ kq: 0, err: err });
        } else {
            res.json({ kq: 1, data: data });
        }
    });
});

module.exports = router;