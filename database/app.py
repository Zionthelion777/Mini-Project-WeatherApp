# app.py
from flask import Flask, request, jsonify # type: ignore
from user_management import register_user, login_user

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    message = register_user(username, password)
    return jsonify({"message": message})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    message = login_user(username, password)
    return jsonify({"message": message})

if __name__ == '__main__':
    app.run(debug=True)