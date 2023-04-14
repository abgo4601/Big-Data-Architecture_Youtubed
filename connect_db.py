from dotenv import load_dotenv
from mongoengine import connect
from model import User
import uuid
import os

def connect_db():
    try:
        load_dotenv()
        connect(host=os.getenv("CLUSTER_URL"))
        print("Database cluster connected")
    except Exception as e:
        print(e.args)