# database_config.py
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="zbishop",
        password="Zb44696924",
        database="weatherapp"
    )