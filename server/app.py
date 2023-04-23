from flask import Flask, jsonify,redirect,url_for,render_template,request
from themoviedb import TMDb
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

from googleapiclient.discovery import build
import requests

import openai
import os
import pickle

app = Flask(__name__,template_folder='templates')
from dotenv import load_dotenv

load_dotenv()
tmdbkey=os.getenv("TMDB_KEY")
spotify_id=os.getenv("SPOTIFY_CLIENT_ID")
spotify_secret=os.getenv("SPOTIFY_CLIENT_SECRET")

tmdb = TMDb(key=tmdbkey, language="en-US")

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

@app.route('/authenticate')
def authenticate():

    credentials = generate_credentials()

    return credentials.to_json()

def generate_credentials():

    flow = InstalledAppFlow.from_client_config(
        CLIENT_CONFIG,
        scopes=[
            'https://www.googleapis.com/auth/youtube.readonly'
        ]
        )

    flow.run_local_server(port=8080, prompt='consent',
                                authorization_prompt_message='')

    # Save the credentials for the next run
    with open('token.pickle', 'wb') as f:
        print('Saving Credentials for Future Use...')
        pickle.dump(flow.credentials, f)

    return flow.credentials
   
def get_liked_videos():

    # token.pickle stores the user's credentials from previously successful logins
    if os.path.exists('token.pickle'):
        print('Loading Credentials From File...')
        with open('token.pickle', 'rb') as token:
            credentials = pickle.load(token)
    
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            print('Refreshing Access Token...')
            credentials.refresh(Request())
        else:
            credentials = generate_credentials()

    youtube = build('youtube', 'v3', credentials=credentials)

    results = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        myRating='like', maxResults=25
    ).execute()

    return results


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

@app.route('/recommendations')
def youtube_tags():
    results = get_liked_videos()

    video_tags = []

    for item in results["items"]:
        item_snippet = item["snippet"]
        if 'tags' in item["snippet"].keys():
            for t in item["snippet"]["tags"]:
                if t not in video_tags:
                    video_tags.append(t)
 
    recommendations = get_recommendations(video_tags)
    # print(recommendations)
    return parse_recommendations(recommendations)

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
                "title": top_result.original_title,
                "summary": top_result.overview,
                "release_date": top_result.release_date,
                "popularity": top_result.popularity,
                "voteAverage": top_result.vote_average,
                "voteCount": top_result.vote_count,
                "image": f"https://image.tmdb.org/t/p/original{top_result.poster_path}"
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
                    "release_date": top_result.first_air_date,
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
    print(recommendations)

    for section in sections:
        if "TV Shows:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    shows.append(line.split(". ")[1])
        elif "Movies:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    movies.append(line.split(". ")[1])
        elif "Songs:" in section:
            for line in section.split("\n")[1:]:
                if line:
                    songs.append(line.split(". ")[1])

    # uncomment for debugging purpose for testing response
    print('TV Shows 1:', shows)
    print('Movies 2:', movies)
    print('Songs 3:', songs)
    
    song_details=fetch_song_details(songs)
    movie_details=fetch_movie_details(movies)
    show_details=fetch_show_details(shows)

    # print(f" Song Details:{song_details}")
    # print(f" Movie Details:{movie_details}")
    # print(f" Show Details:{show_details}")

    return jsonify(song_details,movie_details,show_details)


if __name__ == '__main__':
    app.run(debug=True)
