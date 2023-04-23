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


def insert_into_db(username, email, picture,movies,shows,songs):
    try:
        try:
            user = User.objects.get(username=username)
            print({"_id": str(user["id"]), "message": "User already exists"})
        except:
            new_user = User(
                uuid=uuid.uuid4().hex,
                username=username, 
                email=email,
                picture=picture,
                movies=movies,
                shows=shows,
                songs=songs
            )
            new_user.save()
            print({"_id": str(new_user["id"]), "message": "User created"})
    except Exception as e:
        print({"error": e.args})