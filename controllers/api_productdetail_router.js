const express = require('express');
const router = express.Router();

const productModel = require('../models/books_model');

router.get('/:id', (req, res) => {

    productModel.find({idCategory:req.params.id}).exec(function (err, data) {
        if (err) {
            res.json({ kq: 0, err: err });
        } else {
            res.json({ kq: 1, data: data });
        }
    });
});

module.exports = router;