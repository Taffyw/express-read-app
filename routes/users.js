var express = require('express');
var User = require('../models/user.js');
var router = express.Router();

function Users_book(users_book) {

  this.details = users_book.details;
  this.book = users_book.book;
};

function Book(book) {
  this.list = book.list;
  this.content = book.content;
};

/* GET users listing. */
// get的/user请求
router.get('/', function (req, res, next) {

  User.queryUserList(function (err, data) {
    if (err) {
      res.send('对不起查询报错了');
    }
    else {
      res.send(data);
    }
  })

});
//GET的/user/123(ID)请求
router.get('/:id', function (req, res, next) {
  User.queryUserID(req.params.id, function (err, data) {
    if (err) {
      res.send('查询用户信息失败');
    }
    else {
      res.send(data);
    }

  });

});
//------------------------------------------------------------
//用户注册模块

//post的/user请求
router.post('/', function (req, res, next) {
  console.log(req.body);
  var user = new User({
    name: req.body.name,
    password: req.body.password,
    phone_number: req.body.phone_number,
    email: req.body.email
  });
    console.log(user);
    User.addUser(user, function (err, data) {
    if (err) {
      res.send('添加用户信息失败')
    }
    else {
      res.send('新增user成功').end();
    }

  })
});

//用户登录模块   需要传用户密码  用户名字
router.post("/login", function (req, res) {
  // //创建md5加密模块对象
  // var md5 = crypto.createHash('md5');
  // //将密码进行md5加密
  // var password = md5.update(req.body.password).digest('base64');
  //查询用户信息

  User.getUserByName(req.body.name, function (err, result) {
    console.log(req.body);
    //获取用户密码
    console.log(result);
    password = req.body.password;
    if (!result) {
      var data = {
        result:0,
        message:'用户不存在'
      }
      return res.send(data);
    }
    //获取用户ID
    if (result.password != password) {
      var data = {
        result:0,
        message:'密码错误!'
      }
      res.send(data);
    }
    else {
      user_id = result.id;
      //使用用户ID获取用户详细信息
      User.getUserByDetails(user_id, function (err, data) {
        if (err) {
          res.send('查询用户信息失败');
        }
        else {
          console.log(data);
          //将获取到的用户信息给details
          var details = data;
          //获取用户信息完成

          //再次使用用户ID查询书籍信息
          User.getUserByBook(user_id, function (err, data) {
            if (err) {
              res.send('查询书籍信息失败');
            }
            else {
              //将获取的用户书籍信息给Book
              var book = data;
              //将获取的书籍信息与用户信息封装到对象中去；
              var users_book = new Users_book({
                details: details,
                book: book
              });
              var data = {
                result:1,
                message:'登录成功',
                data:users_book
              }
              res.send(data);
            }
          })
        }
      })
    }

    // req.session.user = result;

    //然后跳转到用户信息主页
    // return res.redirect('/？？？.html');
  });
});
router.post('/getfav',function (req,res) {
  var user_id = req.body.uid;
  User.getUserByBook(user_id, function (err, data) {
    if (err) {
      res.send('查询书籍信息失败');
    }
    else {
      //将获取的书籍信息与用户信息封装到对象中去；
      res.send(data);
    }
  })
})
//用户搜索书籍  需要小说名字 直接传汉字
router.post('/search',function(req,res){
  User.searchBook(req.body.b_name,function(err,data){
    if (err) {
          res.send(err);
        }
        else {   
          res.send(data)
        }
  })
})

//全部书籍
router.post('/allbook',function(req,res){
  User.bookList(function(err,data){
    if (err) {
          res.send(err);
        }
        else {
          res.send(data)
        }
  })
})
//用户添加评价
router.post('/comment',function(req,res){
  var data = req.body;
  var b_id = data.b_id;
  var uname = data.uname;
  var content = data.content;
  console.log(req.body);
  User.addComment(b_id,uname,content,function(err,data){
    if (err) {
      res.send(err);
    }
    else {
      res.send('评论成功！')
    }
  })
});
//用户修改资料
router.post('/setdata',function(req,res){
    var data = req.body;
    var uname = data.uname;
    var pass = data.password;
    var phone = data.phone;
    var email = data.email;
    var uid = data.uid;
    console.log(req.body);
    User.setData(uname,pass,phone,email,uid,function(err,data){
        if (err) {
            res.send(err);
        }
        else {
            res.send('修改成功！')
        }
    })
})
//用户添加评价
router.post('/commentlist',function(req,res){
  var data = req.body;
  var b_id = data.b_id;
  User.getCommentList(b_id,function(err,data){
    if (err) {
      res.send(err);
    }
    else {
      res.send(data);
    }
  })
})

//用户点击书籍开始阅读   首先获取列表  需要传书籍ID 
router.post("/content", function (req, res) {
  var id = req.body.b_id;
  User.getUserStart(id,function (err, result) {  
    if (err) {
      res.send('获取书籍目录列表失败');//获取书籍目录列表失败
    }
    else {
      var list = result;
      User.getChaptersByContent(id, 1,function (err, data) {
        if (err) {
          res.send('获取章节内容失败');
        }
        else {
          var content = data;
          //点击阅读时自动显示第一章   将章节列表及第一章内容放入book对象中
          var book = new Book({
            list: list,   
            content: content
          });
          res.send(book);
        }
      })
    }
  })
});
//   点击添加书架按钮将书籍名称存入数据库
//需要穿  用户ID   书籍名称   书籍ID
router.post('/addItem',function(req,res,next){
  var name = req.body.name;
  var id = req.body.id;
  var bookName_id = req.body.b_id;
  console.log(req.body);
  User.addBook(id, name,bookName_id,function (err, data) {
    if (err) {
      res.send('添加书籍信息失败');
    }
    else {
      res.send('添加书籍信息成功');
    }
  })
})
//   点击添加书架按钮将书籍名称存入数据库
//需要穿  用户ID   书籍名称   书籍ID
router.post('/deleteItem',function(req,res,next){
  var bookName_id = req.body.b_id;
  User.deleteBook(bookName_id,function (err, data) {
    if (err) {
      res.send('添加书籍信息失败');
    }
    else {
      res.send('删除成功');
    }
  })
})





//点击章节目录名称时从Mysql 中获取相对应得数据
//传小说ID   章节ID
router.post('/chapter',function(req,res,next){
  var b_id = req.body.b_id;
  var c_id = req.body.c_id;
  User.getChaptersByContent(b_id, c_id,function (err, data) {
        if (err) {
          res.send('获取章节内容失败');
        }
        else {   
          res.send(data);
        }
      })
})


//修改用户信息   传用户ID   name    password
//put的/user/123(id)请求

router.put('/:id', function (req, res, next) {
  console.log(req.params.id);
  //第一步先查询用户信息  并得到信息
  User.queryUserID(req.params.id, function (err, data) {
    if (err) {
      res.send('查询用户信息失败')
    }
    //得到用户信息 并比对  将新值覆盖旧值
    var user = new User(
      {
        id: data[0].id,
        name: data[0].user_name,
        password: data[0].password,
      });
    console.log(user.name);



    if (req.body.name) {
      console.log(req.body.name);
      user.name = req.body.name;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    //第二部调用updata 方法更新信息
    User.updataUser(user, function (err, data) {
      if (err) {
        res.send('修改用户信息失败')
      }
      else {
        res.send('修改用户信息成功，恭喜你中奖了');
      }
    })


  });

});
//delete的/user/123(id)请求
router.delete('/:id', function (req, res, next) {

  User.deleteUser(req.params.id, function (err, cb) {
    if (err) {
      res.send('对不起，你还需要挑灯夜战');
    }
    else {
      res.send('恭喜你，终于解放了');
    }
  })
});

module.exports = router;
