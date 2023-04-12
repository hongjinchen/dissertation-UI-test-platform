from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # 这里是一个模拟的用户数据，实际应用中您需要连接数据库进行用户验证
    users = [
        {
            'email': 'user@example.com',
            'nickname': 'user',
            'password': 'password123'
        }
    ]

    user = None

    for u in users:
        if (u['email'] == data['username'] or u['nickname'] == data['username']) and u['password'] == data['password']:
            user = u
            break

    if user:
        return jsonify({'status': 'success', 'message': '登录成功'})
    else:
        return jsonify({'status': 'error', 'message': '用户名或密码错误'})

@app.route('/logout', methods=['POST'])
def logout():
    # 在实际应用中，您需要销毁用户的会话
    return jsonify({'status': 'success', 'message': '登出成功'})

# 设置路由，装饰器绑定触发函数
@app.route("/")
def hello_world():
    return "Hello, World! pro"

@app.route("/hello", methods=['POST', 'GET'])
def hello():
    print(request)
    respone = {
        "method ": request.method,
        "body": request.json,
        "head": dict(request.headers),
        "data":  request.args
    }
    return respone

if __name__ == '__main__':
    app.run(debug=True)
