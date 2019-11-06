var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Ignore these ===================================
// if(process.argv.indexOf('bypass-db') || process.env.BYPASS_DB) {
//   console.log("bypass-db")
//   view = function(req, res, next) {
//     res.status(200).send('view db');
//   }
//   add = function(req, res, next) {
//     res.status(200).send('add db');
//   }  
// } else {
//   console.log("not bypass-db")
// ================================================


// 从环境变量获取数据库信息
var secret = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD
}
var connection = mysql.createConnection(secret);
connection.connect();


// 这里的path设为'/'，因为app.js里已经设置了app.use('pageview...)，所以只要设置path的剩余部分
// 这个处理GET方法的“查看”
router.get('/', function(req, res, next) {
  try {
    connection.query('SELECT * FROM rideshare.pageview;', function(err, rows, fields) { //这里写SQL query
      if (err) { throw err; } //出错时交给后面的finally去处理      

      // 成功时的处理
      // rows = [ RowDataPacket { count: 0, update_time: 2019-01-15T23:34:59.000Z } ]
      res.status(200).send('Pageview: ' + rows[0].count + '; Updated at ' + rows[0].update_time);
    });
  } catch(err) { // 这里使用try...catch语法，即使出bug也可以正常应答，并且断开和数据库的连接
    res.status(500).send('SERVER ERROR:' + err); // SQL出错时的处理
    connection.end();
  }
});


// 这个处理POST方法的“修改”
router.post('/', function(req, res, next) {
  try {
    queryString = 'SELECT count FROM rideshare.pageview;'
    connection.query(queryString, function(err, rows, fields) {
      if (err) { throw err; }

      // 成功
      pageview = rows[0].count;
      pageview += 1;

      queryString = 'UPDATE rideshare.pageview SET count=' + pageview + ', update_time=NOW();'
      connection.query(queryString, function(err, rows, fields) {
        if (err) { throw err; }
        console.log(rows)
        res.status(200).send('Success. New Pageview: ' + pageview); 
      });
    });
  } catch(err) { 
    res.status(500).send('SERVER ERROR: ' + err); 
    connection.end();
  } 
});

module.exports = router;
