from themoviedb import TMDb
import requests

import openai
import os
import pickle
from connect_db import connect_db,insert_into_db
from dotenv import load_dotenv

res="""TV Shows:
1. The Big Bang Theory
2. Stranger Things
3. Game of Thrones
4. Rick and Morty
5. Breaking Bad
6. Friends
7. The Walking Dead
8. The Crown
9. Westworld
10. The Office
11. Doctor Who
12. Grey's Anatomy
13. The Handmaid's Tale
14. Black Mirror
15. This Is Us

Movies:
1. The Shawshank Redemption
2. The Dark Knight
3. The Godfather
4. Inception
5. Schindler's List
6. The Lord of the Rings
7. Fight Club
8. Forrest Gump
9. The Matrix
10. Star Wars
11. Good Will Hunting
12. Pulp Fiction
13. The Silence of the Lambs
14. The Green Mile
15. Gladiator

Songs:
1. "Space 1.8" by Nala Sinephro
2. "Wird Schon Irgendwie Gehn" by AnnenMayKantereit
3. "Toms Diner" by Suzanne Vega
4. "Chura Liya Hai Tumne Jo Dil Ko" by Mohammad Rafi
5. "Sajaunga Lutkar Bhi Tere Badan Ki Daali Ko" by Asha Bhosle
6. "Instant Karma" by John Lennon
7. "Funky Tech House Mix 2019" by Groove
8. "Comfortably Numb" by Pink Floyd
9. "Guitar Hero" by Max Newman
10. "The Wall" by Smiley Core
11. "Shred" by Reuben Gingrich
12. "David Gilmour Solo" by Bob Ezrin
13. "James Guthrie Solo" by Michael Kamen
14. "Moneypit" by CGPGrey
15. "Escape" by Storror POV"""

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
                "release_date": top_result.release_date.strftime('%Y-%m-%d'),
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
                    "release_date": top_result.first_air_date.strftime('%Y-%m-%d'),
                    "popularity": top_result.popularity,
                    "voteAverage": top_result.vote_average,
                    "voteCount": top_result.vote_count,
                    "image": f"https://image.tmdb.org/t/p/original{top_result.poster_path}"
                })
    return out

def parse_recommendations(res):
    shows=[]
    movies=[]
    songs=[]

    # Split the text response into separate sections for each category
    sections = res.split("\n\n")

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
                    print(line)
                    songs.append(line.split(". ")[1])

    # uncomment for debugging purpose for testing response
    # print('TV Shows:', shows)
    # print('Movies:', movies)
    # print('Songs:', songs)
    
    song_details=fetch_song_details(songs)
    movie_details=fetch_movie_details(movies)
    show_details=fetch_show_details(shows)

    return [song_details,movie_details,show_details]

print(parse_recommendations(res))