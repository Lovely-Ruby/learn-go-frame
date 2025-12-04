# ---------- 1. Builder 阶段 ----------
FROM golang:1.22-alpine AS builder

# 设置环境变量（GoFrame 建议关闭 CGO）
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /app

# 安装 git（用于 go mod 下载）
RUN apk add --no-cache git

# 复制 go.mod、go.sum，提前下载依赖（加速构建）
COPY go.mod go.sum ./
RUN go mod download

# 复制所有代码
COPY . .

# 编译二进制
RUN go build -o server main.go


# ---------- 2. 最终运行阶段 ----------
# 使用更小的容器
FROM alpine:3.20

WORKDIR /app

# 复制编译的可执行文件
COPY --from=builder /app/server .

# 如果用到了配置文件（config.yaml/sql等），补充复制
COPY config/ ./config/
# 或你的具体路径，比如：
# COPY manifest/config/config.yaml ./config.yaml

# 运行端口（按你的 GoFrame 默认配置调整）
EXPOSE 8000

# 启动
CMD ["./server"]
