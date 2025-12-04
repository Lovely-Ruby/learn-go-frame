# === 构建阶段 ===
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build


# === 运行阶段：使用 Caddy 作为静态服务器 ===
FROM caddy:2-alpine

# 将构建产物复制到 Caddy 默认站点目录
COPY --from=build /app/dist /usr/share/caddy

# 复制 Caddyfile（如果你需要自定义路由）
COPY Caddyfile /etc/caddy/Caddyfile
