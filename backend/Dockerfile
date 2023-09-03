# 使用一个已有的 Python 镜像作为基础
FROM python:3.8

# 设置工作目录
WORKDIR /app

# 将依赖文件复制到容器内
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制其余的源代码到工作目录
COPY . .

# 使端口可用于外界
EXPOSE 5000

# 运行命令
CMD ["flask", "run", "--host=0.0.0.0"]
