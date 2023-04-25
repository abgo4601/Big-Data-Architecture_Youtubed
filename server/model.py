
from mongoengine.document import Document
from mongoengine.fields import EmailField, StringField, UUIDField, ListField, DictField

# inheriting from Document class
class User(Document):
    meta = {"collection": "User"}
    uuid=UUIDField()
    username=StringField(required=True, max_length=100)
    password=StringField(required=True, max_length=100, default="LOGGEDINWITHGOOGLE")
    email=EmailField()
    movieRecos=ListField(DictField())
    tvshowRecos=ListField(DictField())
    musicRecos=ListField(DictField())