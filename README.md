# 技术栈
1. 前端： vue.js vue-cli axios webpack
2. 后端： nodejs/express mongoDB

# 各模块介绍
1. 商品列表模块  --'server/routes/goods'
2. 登录登入模块  --'server/routes/users'
3. 购物车模块    --'server/routes/users'
4. 拦截器定义    --'server/app.js'
5. 前端页面地址  --'src/views'
6. 前端组件地址  --'src/components' 

# shop

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
# server
这里的server本应是一个单独的项目，将其放到了shop下，共用一个package.json

``` bash
#导入所有的collection到数据库
mongoimport -d db_shop -c goods --file C:\Users\wangwensheng\Desktop\shop\server\db\shop-goods

#启动服务器
cd C:\Users\wangwensheng\Desktop\shop\server\bin>
node www
```


