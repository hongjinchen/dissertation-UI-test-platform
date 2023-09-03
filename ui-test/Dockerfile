# 使用官方的 node 基础镜像
FROM node:latest

# 在容器内创建一个目录来存储你的应用代码
WORKDIR /app

# 复制你的 package.json 和 package-lock.json （如果有的话）到新创建的目录
COPY package*.json ./

# 使用 npm 安装你的应用依赖
RUN npm install --legacy-peer-deps

# 复制你的应用源代码到新创建的目录
COPY . .

# 告诉 Docker 你的应用将在 3000 端口提供服务
EXPOSE 3000

# 定义你的应用启动命令
CMD ["npm", "start"]
