# 问题

我把前端项目打包成 docker ，我的后端接口是 http://localhost:8000/api/v1/todo
但是我打包的容器，访问的时候，会有几帧正常的页面，然后渲染数据的时候报错
```
❌ 加载失败：Unexpected token '<', "<!doctype "... is not valid JSON
```
我发现接口返回的是 html，这是为什么呢

# 问题 2

docker run -d --name todo-front-test -p 2345:80 todo-front-test 我在宿主机上访问 2345 接口之后，

http://localhost:2345/api/v1/todo 这个请求变成 304 了，然后返回了 html

# 问题 3

这是硬编码的，在容器中会写死。

VITE_API_URL=http://localhost:8000

VITE_APP_TITLE=todo待办清单
