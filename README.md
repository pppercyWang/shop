# shop

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
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


