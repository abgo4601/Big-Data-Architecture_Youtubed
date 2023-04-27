from flask import Flask,jsonify
import json
import requests
from flask.globals import request, session
from flask.wrappers import Response
from google.oauth2 import id_token
from werkzeug.utils import redirect
from dotenv import load_dotenv
from flask_cors import CORS
import os
from google_auth_oauthlib.flow import Flow
from flask_pymongo import PyMongo
from user import User
from werkzeug.exceptions import abort
import jwt
from themoviedb import TMDb
import openai
import google
from pip._vendor import cachecontrol
from googleapiclient.discovery import build
from elasticsearch import Elasticsearch

app = Flask(__name__)
load_dotenv()
CORS(app)
app.config['Access-Control-Allow-Origin'] = '*'
app.config["Access-Control-Allow-Headers"]="Content-Type"

app.config['MONGO_DBNAME'] = "youtubed"
app.config['MONGO_URI'] = os.getenv("CLUSTER_URL")
mongo = PyMongo(app)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
app.secret_key = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
BACKEND_URL=os.getenv("BACKEND_URL")
CLIENT_CONFIG = {'web': {
    'client_id': os.getenv("GOOGLE_CLIENT_ID"),
    'project_id': os.getenv("GOOGLE_PROJECT_ID"),
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://www.googleapis.com/oauth2/v3/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_secret': os.getenv("GOOGLE_CLIENT_SECRET"),
    'redirect_uris': os.getenv("GOOGLE_REDIRECT_URIS"),
    'javascript_origins': os.getenv("GOOGLE_JAVASCRIPT_ORIGINS")
}}

BACKEND_URL=os.getenv("BACKEND_URL")
FRONTEND_URL=os.getenv("FRONTEND_URL")
algorithm = os.getenv("ALGORITHM")

tmdbkey=os.getenv("TMDB_KEY")
spotify_id=os.getenv("SPOTIFY_CLIENT_ID")
spotify_secret=os.getenv("SPOTIFY_CLIENT_SECRET")

tmdb = TMDb(key=tmdbkey, language="en-US")

ELASTIC_PASSWORD = "JLuHzd3N58xmJ8fBdmTYYW3e"

# Found in the 'Manage Deployment' page
CLOUD_ID = "youtubed:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRlNmU4YzMyYTljNzI0ZjMyYmI0MzVhN2ZjZGQxNGFlNCQ4ODczZDUyMDA0NjI0OTZhOTNmNmQzMjgzMzYyYzZlZg=="

# Create the client instance
client = Elasticsearch(
    cloud_id=CLOUD_ID,
    basic_auth=("elastic", ELASTIC_PASSWORD)
)

BASE_URL = 'https://api.pushshift.io'

def login_required(function):
    def wrapper(*args, **kwargs):
        encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
        if encoded_jwt==None:
            return abort(401)
        else:
            return function()
    return wrapper

def Generate_JWT(payload):
    encoded_jwt = jwt.encode(payload, app.secret_key, algorithm=algorithm)
    return encoded_jwt


flow = Flow.from_client_config(
    CLIENT_CONFIG,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        'https://www.googleapis.com/auth/youtube.readonly'
    ],
    redirect_uri="http://127.0.0.1:5000/callback",
)

def get_recommendations(tags):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    model_engine = "text-davinci-003"
    prompt = f"Recommend me names of top 15 TV shows, movies that are listed on IMDB and songs listed on Spotify based on the following tags: {tags}. Return the response in json format with keys as shows, movies, songs"

    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.8,
    )

    return response.choices[0].text

def fetch_song_details(collection):
    out=[]
    AUTH_URL = "https://accounts.spotify.com/api/token"

    auth_response = requests.post(AUTH_URL, {
        'grant_type': 'client_credentials',
        'client_id': spotify_id,
        'client_secret': spotify_secret,
    })

    access_token = auth_response.json()['access_token']
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    QUERY_URL = "https://api.spotify.com/v1/search"

    for song in collection:
        query_params = {
            'q': song,
            'type': 'track',
            'limit': 1,
        }
        response = requests.get(QUERY_URL, headers=headers, params=query_params)
        json_response = response.json()
        if(json_response['tracks']['items']):
            out.append({
                "poster_path": str(json_response['tracks']['items'][0]['album']['images'][1]['url']),
                "title": str(json_response['tracks']['items'][0]['name']),
                "id": str(json_response['tracks']['items'][0]['id']),
                "artist": str(json_response['tracks']['items'][0]['artists'][0]['name']),
                "release_date": json_response['tracks']['items'][0]['album']['release_date'],
                "vote_average": int(json_response['tracks']['items'][0]['popularity'])/10,
                "mediaType": "Song"
            })
    return out

def fetch_movie_details(collection):
    out=[]
    for movie in collection:
        results=tmdb.search().movies(movie).results
        if len(results)>0:
            top_result=results[0]
            out.append({
                "poster_path": str(top_result.poster_path),
                "title": str(top_result.original_title),
                "id": int(top_result.id),
                "vote_average": float(top_result.vote_average),
                "release_date": top_result.release_date.strftime('%Y-%m-%d') or "2023-01-01",
                "mediaType": "Movie"
            })
    return out

def fetch_show_details(collection):
    out=[]
    for show in collection:
        results=tmdb.search().tv(show).results
        if len(results)>0:
            top_result=results[0]
            out.append({
                "poster_path": str(top_result.poster_path),
                "title": str(top_result.name),
                "id": int(top_result.id),
                "vote_average": float(top_result.vote_average),
                "release_date": top_result.first_air_date.strftime('%Y-%m-%d') or "2023-01-01",
                "mediaType": "tv"
                })
    return out

def parse_recommendations(recommendations):
    shows=[]
    movies=[]
    songs=[]

    sections = recommendations.split("\n\n")
    json_data = json.loads(sections[1])
    print(json_data)
    lowercase_json={key.lower(): value for key,value in json_data.items()}

    shows=lowercase_json["shows"]
    movies=lowercase_json["movies"]
    songs=lowercase_json["songs"]

    if not movies:
        movies=['The Shawshank Redemption', 'The Dark Knight', 'The Godfather', 'Inception', "Schindler's List", 'The Lord of the Rings', 'Fight Club', 'Forrest Gump', 'The Matrix', 'Star Wars', 'Good Will Hunting', 'Pulp Fiction', 'The Silence of the Lambs', 'The Green Mile', 'Gladiator']

    if not shows:
        shows=['The Big Bang Theory', 'Stranger Things', 'Game of Thrones', 'Rick and Morty', 'Breaking Bad', 'Friends', 'The Walking Dead', 'The Crown', 'Westworld', 'The Office', 'Doctor Who', "Grey's Anatomy", "The Handmaid's Tale", 'Black Mirror', 'This Is Us']

    if not songs:
        songs=['Bohemian Rhapsody', 'Stairway to Heaven', 'Hotel California', 'Sweet Child O Mine', 'Imagine', 'Like a Rolling Stone', 'Hey Jude', 'Purple Haze', 'Smells Like Teen Spirit', 'Born to Run']

    song_details=fetch_song_details(songs)
    movie_details=fetch_movie_details(movies)
    show_details=fetch_show_details(shows)

    return [movie_details,show_details,song_details]

@app.route("/auth/google")
def login():
    authorization_url, state = flow.authorization_url()
    # Store the state so the callback can verify the auth server response.
    session["state"] = state
    return Response(
        response=json.dumps({'auth_url':authorization_url}),
        status=200,
        mimetype='application/json'
    )


@app.route('/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token, request=token_request,
        audience=GOOGLE_CLIENT_ID,clock_skew_in_seconds=10
    )
    session["google_id"] = id_info.get("sub")

    del id_info['aud']
    jwt_token=Generate_JWT(id_info)
    youtube = build('youtube', 'v3', credentials=credentials)

    results = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        myRating='like', maxResults=25
    ).execute()

    video_tags = []

    for item in results["items"]:
        if 'tags' in item["snippet"].keys():
            for t in item["snippet"]["tags"]:
                if t not in video_tags:
                    video_tags.append(t)

    users = mongo.db.users
    existing_user = users.find_one({'email': id_info.get('email')}, {'_id': 0})

    if existing_user is None:
        recommendations = get_recommendations(video_tags)
        res=parse_recommendations(recommendations)
        new_user = User(id_info.get('name'),id_info.get('email'),res[0],res[1],res[2])
        user_data_to_save = new_user.dict()
        users.insert_one(user_data_to_save)

    return redirect(f"{FRONTEND_URL}/home?token={jwt_token}")

@app.route("/recommendations")
@login_required
def user_recommendations():
    encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
    try:
        decoded_jwt=jwt.decode(encoded_jwt, app.secret_key, algorithms=[algorithm,])
    except Exception as e: 
        return Response(
            response=json.dumps({"message":"Decoding JWT Failed", "exception":e.args}),
            status=500,
            mimetype='application/json'
        )
    user=mongo.db.users.find_one({"email": decoded_jwt.get('email')},{"showRecos": 1,"movieRecos": 1,"songRecos": 1})

    return Response(
        response = json.dumps({"shows": user.get("showRecos", []),"movies": user.get("movieRecos", []),"songs": user.get("songRecos", [])}),
        status=200,
         mimetype='application/json'
    )

@app.route('/apiv1/search/<string:searchString>' , methods=['GET'])
def searchComment(searchString: str):
    result = []
    esResult = client.search(
        index='reddit-comments',
        query={
        'match': {'search_term': searchString}
        }
    )
    commentsList = esResult['hits']['hits']
    size = len(commentsList)
    if commentsList is None or size == 0:
        result = updateCommentToEs(searchString)
    else:
      for list in commentsList:
        comment = {}
        comment['comment'] = list['_source']['comment']
        comment['timestamp'] = list['_source']['timestamp']
        result.append(comment)
    return Response(response=json.dumps(result), status=200, mimetype="application/json")

def updateCommentToEs(searchString: str):
   result = [] 
   query = "reddit/comment/search/?q="+searchString+"&after=7d"
   response = requests.get(f"{BASE_URL}/{query}")
   commentsList = response.json().get('data')
   commentsList = response.json().get('data')
   for list in commentsList:
       comment = {}
       if list.get('author_flair_type') == 'text':
               client.index(
                   index='reddit-comments',
                   document={
                       'search_term': searchString,
                       'comment': list.get('body'),
                       'timestamp': list.get('created_utc')
                   })
               comment['comment'] = list.get('body')
               comment['timestamp'] = list.get('created_utc')
               result.append(comment)
   client.indices.refresh(index='reddit-comments')    
   return result   

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")