const express = require('express');
const router = express.Router();

router.get('/index', (req, res)=>{
    link = req.originalUrl;
    var tachchuoi = link.split('/');
    var main = 'quotations/main';
    res.render('index', { main:main, link:tachchuoi[1], url:''});
});

module.exports = router;