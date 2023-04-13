from themoviedb import TMDb
from dotenv import load_dotenv
import os
import requests

load_dotenv()

tmdbkey=os.getenv("TMDB_KEY")
spotify_id=os.getenv("SPOTIFY_CLIENT_ID")
spotify_secret=os.getenv("SPOTIFY_CLIENT_SECRET")

tmdb = TMDb(key=tmdbkey, language="en-US")
    
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

print(fetch_movie_details(movies))
print(fetch_show_details(shows))
print(fetch_song_details(songs))
        