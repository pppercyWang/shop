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

## 效果演示 css3以及媒体查询实现PC端移动端适配和动画
![image](https://github.com/pppercyWang/shop/blob/master/static/shop.gif)
