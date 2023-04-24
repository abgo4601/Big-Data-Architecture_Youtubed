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
from connect_db import connect_db, insert_into_db
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
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client-secret.json")
algorithm = os.getenv("ALGORITHM")
BACKEND_URL=os.getenv("BACKEND_URL")
FRONTEND_URL=os.getenv("FRONTEND_URL")

#database connection
connect_db()

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        'https://www.googleapis.com/auth/youtube.readonly'
    ],
    redirect_uri=BACKEND_URL+"/callback",
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
                "title": json_response['tracks']['items'][0]['name'],
                "artist": json_response['tracks']['items'][0]['artists'][0]['name'],
                "album": json_response['tracks']['items'][0]['album']['name'],
                "releaseDate": json_response['tracks']['items'][0]['album']['release_date'],
                "popularity": json_response['tracks']['items'][0]['popularity'],
                "image": json_response['tracks']['items'][0]['album']['images'][1]['url'],
                "previewUrl": json_response['tracks']['items'][0]['preview_url'],
                "externalUrl": json_response['tracks']['items'][0]['external_urls']['spotify']
            })
    return out

def fetch_movie_details(collection):
    out=[]
    for movie in collection:
        results=tmdb.search().movies(movie).results
        if len(results)>0:
            top_result=results[0]
            out.append({
                "id": top_result.id,
                "title": top_result.original_title,
                "summary": top_result.overview,
                "release_date": top_result.release_date.strftime('%Y-%m-%d'),
                "genre": [x for x in tmdb.genres().movie().results if x.id==top_result.genre_ids[0]][0].name or "Adventure",
                "popularity": top_result.popularity,
                "voteAverage": top_result.vote_average,
                "voteCount": top_result.vote_count,
                "image": f"https://image.tmdb.org/t/p/original{top_result.poster_path}",
                "tagline": tmdb.movie(top_result.id).details().tagline,
                "length": tmdb.movie(top_result.id).details().runtime,
                "cast": list(sorted([{"id": x.id,"name": x.name,"image": f"https://image.tmdb.org/t/p/original{x.profile_path}",
                          "character": x.character, "popularity": x.popularity} for x in tmdb.movie(top_result.id).credits().cast],key=lambda x: x["popularity"], reverse=True))[:10]
            })
    return out

def fetch_show_details(collection):
    out=[]
    for show in collection:
        results=tmdb.search().tv(show).results
        if len(results)>0:
            top_result=results[0]
            out.append({
                    "title": top_result.name,
                    "summary": top_result.overview,
                    "release_date": top_result.first_air_date.strftime('%Y-%m-%d'),
                    "popularity": top_result.popularity,
                    "voteAverage": top_result.vote_average,
                    "voteCount": top_result.vote_count,
                    "image": f"https://image.tmdb.org/t/p/original{top_result.poster_path}"
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

    recommendations = get_recommendations(video_tags)
    res=parse_recommendations(recommendations)

    insert_into_db(
        id_info.get('name'),
        id_info.get('email'),
        res[0],
        res[1],
        res[2]
    )
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


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")