const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));

app.set('view engine', 'ejs');

// Cấu hình đường dẫn file css, js, img, ...
app.use(express.static(path.join(__dirname, '/public/admin/')));

//CROS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
  
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Pass to next layer of middleware
    next();
  });
// connect database
require('./dbconnect');

// Load index_router
 const index_router = require('./controllers/index_router');
 app.use('/', index_router);

app.listen(3000, ()=>{ console.log('Đã kết nối') });