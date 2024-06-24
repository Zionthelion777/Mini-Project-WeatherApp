# user_management.py
import bcrypt
from database_config import get_db_connection

def register_user(username, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        connection.commit()
    except mysql.connector.IntegrityError: # type: ignore
        return "Username already exists"
    finally:
        cursor.close()
        connection.close()
    
    return "User registered successfully"

def login_user(username, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if result:
        stored_password = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            return "Login successful"
        else:
            return "Incorrect password"
    else:
        return "Username not found"