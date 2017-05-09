//用链接池去链接数据库
//引入mysql
// var mysql = require('mysql');
// //创建一个链接池
// var pool  = mysql.createPool({
//   connectionLimit : 20,
//   host            : '192.168.141.40',
//   user            : 'user1',
//   password        : '123456',
//   database        : 'user1'
// });

// pool.query('SELECT * FROM klt_user', function(err, rows, fields) {
//   if (err) throw err;
//  console.log(rows);
//   //console.log('The solution is: ', rows[0].solution);
//    //释放链接

// });
//
//获取一个链接然后在进行查询操作
// pool.getConnection(function(err, connection) {
//   connection.query( 'SELECT * FROM klt_user', function(err, rows) {
//     console.log(rows);
//     connection.release();
//   });
// });




'use strict';

const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'root',
  password        : '',
  database        : 'test1'
});


// 如果用户传递了两个参数，那么第一个就是 SQL 操作字符串， 第二个就是回调函数
// 如果是三个参数：第一个SQL字符串，第二个数组，第三个参数回调函数
exports.query = function () {
  let args = arguments;

  let sqlStr = args[0];
  let params = [];
  let callback;

  if (args.length === 2 && typeof args[1] === 'function') {
    callback = args[1];
  } else if (args.length === 3 && Array.isArray(args[1]) && typeof args[2] === 'function') {
    params = args[1];
    callback = args[2];
  } else {
    throw new Error('参数个数不匹配');
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    }
    connection.query(sqlStr, params, function (err, rows) {
      if (err) {
        callback(err);
      }
      //释放链接
      connection.release();
      callback.apply(null, arguments);
    });
  });
};


