let express = require('express');
let router = express.Router();
let User = require('../models/user')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',(req,res)=>{
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){  //如果doc有值，则证明user存在
        res.cookie('userId',doc.userId,{   //将userId放入cookie
          path:'/',
          maxAge:1000*60*60   //cookie存在的时间，毫秒为单位
        })
        res.cookie('userName',doc.userName,{  
          path:'/',
          maxAge:1000*60*60   
        })
        res.json({
          status:'0',
          msg:'',
          result:{   //这里要返回userName，前台页面需要用到
            userName:doc.userName
          }
        })
      }else{ 
        res.json({
          status:'1',
          msg:'you have a mistake on username or password',
          
        })
      }
    }
  })

})
router.post('/logout',(req,res)=>{
  res.cookie('userId','',{  //将cookie中userId的值设为空，时间设为-1，使其生效
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})
router.get('/checkLogin',(req,res)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName  //如果cookies里有userId,证明用户登录过,并在一定时间内有效，所以将userName返回过去
    })
  }else{
    res.json({
      status:'0',
      msg:'未登录',
      result:'' 
    })
  }
})
//查询用户名下的购物车数据
router.get('/cartList',(req,res,next)=>{
  //req.cookies用来读，res.cookies()用来写
  let userId = req.cookies.userId;  //这里不需要判断cookies中有无userID，假如没有的话，肯定会拦截下来
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
//删除购物车项
router.post('/cart/del',(req,res,next)=>{
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({userId:userId},{$pull:{
    'cartList':{
      'productId':productId
    }
  }},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})
module.exports = router;
