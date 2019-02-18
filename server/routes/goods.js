let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const url = 'mongodb://@localhost:27017/db_shop'
let Goods = require('../models/goods')
//连接mongoDB数据库
mongoose.connect(url,(err) =>{
  if(err){
    console.log("连接失败")
  }else{
    console.log("成功连接")
  }
} )
//一级路由在app.js中已经定义了
router.get('/list',(req,res,next)=>{  //二级路由
  let page = parseInt(req.param("page"));  //get请求获得的参数都是字符串
  let pageSize = parseInt(req.param("pageSize"));  
  let skip = (page-1)*pageSize;  //拿到所有goods时，需要跳过的条数
  let sort = parseInt(req.param("sort"));  //sort为1为升序，为-1为降序
  let condition = {}; //mongoose的查询条件都是一个对象
  let priceGt='',priceLte=''
  let priceLevel = (req.param("priceLevel"))
  if(priceLevel!='all'){
    switch(priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=2000;break;
    }
    condition = {  
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(condition).skip(skip).limit(pageSize);
  if(sort!=0){  //前端传过来的sort分别为-1，1，0
    goodsModel.sort({'salePrice':sort})
  }
  goodsModel.exec((err,docs)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:docs.length,
          list:docs
        }
      })
    }
  })
})
//加入购物车
router.post('/addCart',(req,res)=>{   //二级路由
  let userId = req.cookies.userId,productId = req.body.productId   //get请求：res.param("productId")   post请求：req.body.productId
  let User = require('../models/user')
  User.findOne({userId:userId},(err1,userDoc)=>{
    if(err1){
      res.json({
        status:'1',
        msg:err1.message
      })
    }else{
      if(userDoc){
        let goodsItem = ''
        userDoc.cartList.forEach(item => {
          if(item.productId == productId){  //判断cartList是否已经有了这个商品
            goodsItem = item  //如果有就将item赋值给goodsItem
            item.productNum++
            userDoc.save((err4)=>{
              if(err4){
                res.json({
                  status:'1',
                  msg:err4.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'success'
                })
              }
            })
          }
        });
        if(goodsItem == ''){  //如果goodsItem无值则代表cartList无该商品信息，执行下面的代码。如果有值则不用执行下面的代码了
          Goods.findOne({productId:productId},(err2,goodsDoc)=>{
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{
              if(goodsDoc){
                goodsDoc.productNum = 1
                goodsDoc.checked = 1
                userDoc.cartList.push(goodsDoc)
                userDoc.save((err3)=>{
                  if(err3){
                    res.json({
                      status:'1',
                      msg:err3.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'success'
                    })
                  }
                })
              }
            }
          })
        }
        
      }

    }
  })
})
module.exports = router