//首先先创建  user 所有键的对象
var db =  require('./db.js');
var express = require('express');


function User(user){
    this.id = user.id;
    this.name = user.name;
    this.password = user.password;
    this.phone_number = user.phone_number;
    this.email = user.email;
};

//请求用户列表
User.queryUserList = function(cb){
    //SELECT * FROM USER
    db.query('SELECT * FROM USER',function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
   
};

//请求用户ID
User.queryUserID = function(id,cb){
    //SELECT * FROM USER WHERE id=1
    db.query('SELECT * FROM USER WHERE id=?',[id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
};
//查询用户信息
User.getUserByName = function (username, callback) {
	var selectSql = 'select * from user where user_name = ?';
	db.query(selectSql, [username], function (err, result) {
		if (err) {
			console.log('getUserbyUsername err:' + err);
			return;
		}
		console.log('Get name success');
		var data=result[0];
		callback(err, data);
	});
};

//查询用户资料详情
User.getUserByDetails = function(id,cb){
    var calculate = 'SELECT * FROM user WHERE id = ?';
    db.query(calculate,[id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            var result=data[0];
            cb(null,result);
        }
    })
};

//搜索书籍
User.searchBook = function(B_name,cb){
    //SELECT * FROM book_name WHERE NAME='贼警'
  console.log(B_name);
  db.query('SELECT * FROM book_name WHERE NAME=?',[B_name],function(err,data){
    console.log(err);
    if(err){
            cb(err);
        }
        else{
          console.log(data);
          cb(null,data)
        }
    })
};
//全部书籍
User.bookList = function(cb){
    db.query('SELECT * FROM book_name',function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
};


//查询用户书籍详情  
User.getUserByBook = function(id,cb){
    var user_book = 'SELECT DISTINCT * FROM user_book WHERE id = ?';

    db.query(user_book,[id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data);
        }
    })
};

//用户开始阅读时获取书籍内容   
User.getUserStart = function(b_id,cb){
    //获取小说章节列表
   
    // var B_chapter = B_name + '.chapter'
    //SELECT 贼警.chapter FROM 贼警    'SELECT * FROM USER'   'SELECT zj.chapter FROM zj'
    var books = 'SELECT chapter_id,chapter FROM content WHERE book_id=?';//[B_chapter,B_name],
    db.query(books,[b_id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data);
        }
    })
    
}


// db.query('SELECT * FROM USER',function(err,data){
//         if(err){
//             cb(err);
//         }
//         else{
//             cb(null,data)
//         }
//     })


//获取每一张的具体内容   SELECT content FROM content WHERE book_id=1 and chapter_id=3
//传小说ID  与小说章节ID
User.getChaptersByContent = function(bookName_id,chapters_id,cb){
    var content = 'SELECT content FROM content WHERE book_id=? AND chapter_id=?';        //[book_name,book_name,chapters_id],
    db.query(content,[bookName_id,chapters_id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data);
        }
    })
}



//添加用户信息
User.addUser = function(user,cb){
    //INSERT INTO USER VALUES(NULL,'李毅','123456')    INSERT INTO USER VALUES(4,'刘明','123456')
    db.query('INSERT INTO USER VALUES(NULL,?,?,?,?)',[user.name,user.password,user.phone_number,user.email],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
};

//添加用户收藏书籍信息
User.addBook= function(id,book_name,bookName_id,cb){
    //INSERT INTO USER VALUES(NULL,'李毅','123456')
    db.query('INSERT INTO user_book VALUES(?,?,?)',[id,book_name,bookName_id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
};



//用户删除收藏书籍
User.deleteBook= function(id,cb){
  db.query('DELETE FROM user_book WHERE book_id=?',[id],function(err, data){
    if(err){
      cb(err);
    }
    else{
      cb(null,data)
    }
});
};
//添加评价
User.addComment= function(b_id,uname,content,cb){
  //INSERT INTO USER VALUES(NULL,'李毅','123456')
  db.query('INSERT INTO comment VALUES(?,?,?)',[b_id,uname,content],function(err,data){
    if(err){
      cb(err);
    }
    else{
      cb(null,data)
    }
  })
};
//修改资料
User.setData= function(uname,password,phone,email,uid,cb){
    //INSERT INTO USER VALUES(NULL,'李毅','123456')
    console.log('手机号'+phone);
    db.query('UPDATE user SET user_name=?,password=?,phone_number=?,email=? WHERE id=?',[uname,password,phone,email,uid],function(err,data){
        if(err){
            cb(err);
        }
        else{
            console.log(data);
            cb(null,data)
        }
    })
};
//根据书籍id获取评价内容
User.getCommentList= function(b_id,cb){
  var comments = 'SELECT * FROM comment WHERE b_id=?';//[B_chapter,B_name],
  db.query(comments,[b_id],function(err,data){
    if(err){
      cb(err);
    }
    else{
      cb(null,data);
    }
  })
};
//更新用户信息
User.updataUser = function(user,cb){
//UPDATE USER SET u_name='周君',pw='123' WHERE id=3
    db.query("UPDATE USER SET user_name=?,password=? WHERE id=?",[user.name,user.password,user.id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
}

//删除用户信息
User.deleteUser = function(id,cb){
    db.query("delete from user where id=?",[id],function(err,data){
        if(err){
            cb(err);
        }
        else{
            cb(null,data)
        }
    })
};


module.exports = User;