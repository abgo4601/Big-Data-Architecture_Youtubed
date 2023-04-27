from datetime import datetime
import uuid

# User class
class User():
    def __init__(self, name, email, movieRecos,showRecos,songRecos,id=""):
        # Main initialiser
        self.name = name
        self.email = email
        self.id = uuid.uuid4().hex if not id else id
        self.movieRecos=movieRecos
        self.showRecos=showRecos
        self.songRecos=songRecos

    @classmethod
    def make_from_dict(cls, d):
        # Initialise User object from a dictionary
        return cls( d['name'], d['email'], d['id'], d['movieRecos'],d['showRecos'],d['songRecos'])

    def dict(self):
        # Return dictionary representation of the object
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "showRecos": self.showRecos,
            "movieRecos": self.movieRecos,
            "songRecos": self.songRecos,
        }

    def display_name(self):
        return self.name

    @property
    def is_authenticated(self):
        return True

    def get_id(self):
        return self.id