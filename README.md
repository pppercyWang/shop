# shop
### 安装包
*这里的server本应是一个独立的服务端api项目，这里将其放到了shop下，共用一个package.json*
``` bash
npm install
```
### import db数据 在src/db
``` bash
mongoimport --host=127.0.0.1 -d db_shop -c goods --file C:\Users\Administrator\Desktop\shop\server\db\shop-goods
```

## 启动服务
### api
``` bash
cd C:\Users\wangwensheng\Desktop\shop\server\bin
node www
```

### 前端
``` bash
cd C:\Users\wangwensheng\Desktop\shop
npm run dev
```


## 技术栈
* 前端： vue.js vue-cli axios webpack
* 后端： nodejs/express mongoDB

## 效果演示 PC端移动端适配
![image](https://github.com/pppercyWang/shop/blob/master/static/shop.gif)

# 各模块路径
1. 商品列表模块  --'server/routes/goods'
2. 登录登入模块  --'server/routes/users'
3. 购物车模块    --'server/routes/users'
4. 拦截器定义    --'server/app.js'
5. 前端页面  --'src/views'
6. 前端组件  --'src/components' 
## 模块具体实现

### 商品列表的分页，过滤器，及排序实现
``` bash
//前端：
 getGoodList(flag){
            let param = {
              page:this.page,
              pageSize:this.pageSize,
              priceLevel:this.priceChecked
            }
            if(this.priceSortFlag){
              param.sort=this.sort?1:-1
            }else{
              param.sort=0
            }
            this.loading=true
            axios.get("/goods/list",{
              params:param
            }).then((response)=>{
            let res = response.data
            if(res.status=='0'){
              this.loading=false
              if(flag){
                this.goodList = this.goodList.concat(res.result.list)
                if(res.result.count==0){
                  this.busy=true
                }else{
                  this.busy=false
                }
              }else{
                this.goodList = res.result.list;
                this.busy = false
              }
              
            }else{
              this.goodList = [];
            }
          })
          }
//后端：
router.get('/list',(req,res,next)=>{ 
  let page = parseInt(req.param("page"));  
  let pageSize = parseInt(req.param("pageSize"));  
  let skip = (page-1)*pageSize;  //拿到所有goods时，需要跳过的条数
  let sort = parseInt(req.param("sort"));  //sort为1为升序，为-1为降序
  let condition = {}; 
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
```
### 登录模块中间件cookieParser的使用
``` bash
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
```
### express拦截器的定义
``` bash
//一定要注意拦截器放置的位置，中间件的后面，一级路由的前面
app.use(function(req,res,next){
  if(req.cookies.userId){
    next()
  }else{
    //originalUrl是原路径，包括参数，login和logout都是post请求，所有url里面不带参数
    //所以如果要请求goods/list的话就不能用req.originalUrl == '/goods/list',因为这是个get请求，携带了page,pagesize,sort参数
    //但也可以用req.originalUrl.indexOf('/goods/list')>-1,判断里面有没有
    //path则不管参数，只管路径地址
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path=='/goods/list'){ //设置白名单
      next()
    }else{
      res.json({
        status:'10001',
        msg:'未登录，不可进行此操作 username:admin pwd:123456',
        result:''
      })
    }
  }
})
```
### 购物车模块
``` bash
//前端：通过计算属性实时更新选中框，总价等
computed:{
          checkAllFlag(){
            return this.cartList.length == this.checkedCount
          },
          checkedCount(){
            let count = 0
            this.cartList.forEach((item)=>{
              if(item.checked=='1'){
                count++
              }
            })
            return count
          },
          totalPrice(){
             let money = 0
            this.cartList.forEach((item)=>{
              if(item.checked=='1'){
                money+= parseInt(item.productNum) * parseFloat(item.salePrice)
              }
            })
            return money
          }
//后端：编辑功能
//因为购物车功能只有登录之后才可以使用，所以将它放在users路由中
router.post('/cart/edit',(req,res,next)=>{
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  //因为这里更新的是子文档，如果使用findOne查出来，遍历cartList，最后在save会很麻烦。使用update会很方便
  User.update({"userId":userId,"cartList.productId":productId},
  {
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
},
  (err,doc)=>{
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
```
### vue的子父通信实现模态框组件
``` bash
<template>
    <div>                                                       
     <!-- 这里的mdShow参数是通过props从父组件传递过来的，vue的机制本质上不允许在子组件改变父组件的值，只可以使用props读取 -->
     <!-- 如果一定要改变这个值，则先要在父组件定义一个事件，然后在子组件通过this.$emit触发这个事件 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}" >
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup" ></slot>
              </div>
            </div>
          </div>
    </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

methods:{
    closeModal(){
        this.$emit("close")   //触发父组件定义的事件
    }
  }
```

