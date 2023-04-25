import json
from flask import Flask,jsonify 
from flask.wrappers import Response
from flask.globals import request, session
import requests
from dotenv import load_dotenv
from werkzeug.exceptions import abort
from werkzeug.utils import redirect
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import os, pathlib
import google
from model import User
from connect_db import connect_db, insert_into_db,get_user_recs
import jwt
from flask_cors import CORS
from themoviedb import TMDb
import openai
from googleapiclient.discovery import build
from pip._vendor import cachecontrol

app = Flask(__name__)
load_dotenv()
CORS(app)
app.config['Access-Control-Allow-Origin'] = '*'
app.config["Access-Control-Allow-Headers"]="Content-Type"

tmdbkey=os.getenv("TMDB_KEY")
spotify_id=os.getenv("SPOTIFY_CLIENT_ID")
spotify_secret=os.getenv("SPOTIFY_CLIENT_SECRET")

tmdb = TMDb(key=tmdbkey, language="en-US")

# bypass http
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
app.secret_key = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
algorithm = os.getenv("ALGORITHM")
BACKEND_URL=os.getenv("BACKEND_URL")
FRONTEND_URL=os.getenv("FRONTEND_URL")

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

#database connection
connect_db()

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


# wrapper
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


def get_recommendations(tags):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    model_engine = "text-davinci-003"
    prompt = f"Recommend me names of top 15 TV shows, movies that are listed on IMDB and songs listed on Spotify based on the following tags: {tags}."

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
                "poster_path": json_response['tracks']['items'][0]['album']['images'][1]['url'],
                "title": json_response['tracks']['items'][0]['name'],
                "id": json_response['tracks']['items'][0]['id'],
                "artist": json_response['tracks']['items'][0]['artists'][0]['name'],
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
                "poster_path": {top_result.poster_path},
                "title": top_result.original_title,
                "id": top_result.id,
                "vote_average": top_result.vote_average,
                "release_date": top_result.release_date.strftime('%Y-%m-%d'),
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
                "poster_path": {top_result.poster_path},
                "title": top_result.name,
                "id": top_result.id,
                "vote_average": top_result.vote_average,
                "release_date": top_result.first_air_date.strftime('%Y-%m-%d'),
                "mediaType": "Show"
                })
    return out

def parse_recommendations(recommendations):
    shows=[]
    movies=[]
    songs=[]

    # Split the text response into separate sections for each category
    sections = recommendations.split("\n\n")

    for section in sections:
        if "TV Shows:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    shows.append(line.split(". ")[1].split(" (")[0])
        elif "Movies:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    movies.append(line.split(". ")[1].split(" (")[0])
        elif "Songs:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    songs.append(line.split(". ")[1])

    # uncomment for debugging purpose for testing response
    # print('TV Shows:', shows)
    # print('Movies:', movies)
    # print('Songs:', songs)

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

@app.route("/callback")
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
    
    # removing the specific audience, as it is throwing error
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

    # recommendations = get_recommendations(video_tags)
    # res=parse_recommendations(recommendations)

    # insert_into_db(
    #     id_info.get('name'),
    #     id_info.get('email'),
    #     res[0],
    #     res[1],
    #     res[2]
    # )
    # return {"jwt": jwt_token,"email": id_info.get("email")}
    return redirect(f"{FRONTEND_URL}?jwt={jwt_token}")

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


@app.route("/logout")
def logout():
    #clear the local storage from frontend
    session.clear()
    return Response(
        response=json.dumps({"message":"Logged out"}),
        status=202,
        mimetype='application/json'
    )

@app.route("/home")
@login_required
def home_page_user():
    encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
    try:
        decoded_jwt=jwt.decode(encoded_jwt, app.secret_key, algorithms=[algorithm,])
        print(decoded_jwt)
    except Exception as e: 
        return Response(
            response=json.dumps({"message":"Decoding JWT Failed", "exception":e.args}),
            status=500,
            mimetype='application/json'
        )
    return Response(
        response=json.dumps(decoded_jwt),
        status=200,
        mimetype='application/json'
    )

@app.route("/user/recommendations")
def user_recommendations():
    username = request.args.get('username')

    recs_list = get_user_recs(username)

    return Response(
        response = json.dumps({"movies": recs_list["movieRecos"], "shows":recs_list["tvshowRecos"],"songs": recs_list["musicRecos"]}),
        status=200,
        mimetype='application/json'
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
