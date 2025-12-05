# GoFrame Template For SingleRepo

Quick Start: 
- https://goframe.org/quick

# docker 的一些命令

```bash
# 构建
docker build -t goframe-app:latest -f manifest/docker/Dockerfile .

# 运行容器
docker run -d -p 8080:8000 --name my-goframe-instance goframe-app:latest
```
