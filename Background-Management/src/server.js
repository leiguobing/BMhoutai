const koa = require('koa');
const static = require('koa-static')
const app =new koa();

const routers = require('./api/routes')

//==========创建资源服务器及路由============================================================

 
//创建资源服务器
app.context.myname = 'leidata'


app.use(static('./'))
app.use(routers.allowedMethods());
app.use(routers.routes())


app.listen(10086, () => {
   console.log('服务器启动成功')
})

