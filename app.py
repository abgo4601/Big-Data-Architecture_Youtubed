from flask import Flask, jsonify,session,redirect,url_for,render_template,request

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google_auth_oauthlib.flow import Flow

from googleapiclient.discovery import build

import openai
import os
app = Flask(__name__,template_folder='templates')

"""
# Set up YouTube API client
scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
flow = Flow.from_client_secrets_file("client_secret_392257685147-6iv2tq0hirvsaugnmlncqct79is4jd64.apps.googleusercontent.com.json", scopes=scopes)
api_service_name = "youtube"
api_version = "v3"

# Set up OpenAI API client
# openai.api_key = os.environ["OPENAI_API_KEY"]

# Define the index route
@app.route("/")
def index():
    return render_template("index.html")

# Define the auth route
@app.route("/auth")
def auth():
    authorization_url, state = flow.authorization_url(access_type="offline")
    return redirect(authorization_url)

# Define the callback route
@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session["credentials"] = credentials_to_dict(credentials)
    return redirect(url_for("liked_videos"))

# Define the liked_videos route
@app.route("/youtube_tags")
def liked_videos():
    if "credentials" not in session:
        return redirect(url_for("auth"))
    credentials = Credentials.from_authorized_user_info(session["credentials"], scopes)
    youtube = build(api_service_name, api_version, credentials=credentials)
    results = youtube.videos().list(part="snippet", myRating="like", maxResults=50).execute()
    videos = []
    for item in results["items"]:
        video = {}
        video["id"] = item["id"]
        video["title"] = item["snippet"]["title"]
        video["tags"] = item["snippet"]["tags"]
        videos.append(video)
    recommendations = {}
    for video in videos:
        tags = " ".join(video["tags"])
        # response = openai.Completion.create(engine="davinci", prompt=f"Recommend me a TV show, movie or podcast based on the following tags: {tags}", max_tokens=50)
        # recommendations[video["title"]] = response.choices[0].text
    # return recommendations
    return jsonify(tags)

if __name__ == "__main__":
    app.run(debug=True)

"""

def authenticate_youtube():
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secret_392257685147-6iv2tq0hirvsaugnmlncqct79is4jd64.apps.googleusercontent.com.json',
        scopes=['https://www.googleapis.com/auth/youtube.readonly',"https://www.googleapis.com/auth/youtube.force-ssl"]
    )
    flow.redirect_uri = 'http://localhost:8080'

    credentials = flow.run_console()

    return credentials.to_json()

def get_liked_videos():
    credentials_json = authenticate_youtube()
    credentials = Credentials.from_json(credentials_json)

    youtube = build('youtube', 'v3', credentials=credentials)

    response = youtube.videos().list(
        part='snippet',
        myRating='like'
    ).execute()

    videos = response.get('items', [])

    return videos


def get_recommendations(tags):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    model_engine = "text-davinci-002"
    prompt = f"Recommend me a TV show, movie, or podcast based on the following tags: {tags}"

    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=50,
        n=1,
        stop=None,
        temperature=0.5,
    )

    return response.choices[0].text

@app.route('/youtube_tags')
def youtube_tags():
    videos = get_liked_videos()

    tags = []
    for video in videos:
        tags += video['snippet']['tags']

    # recommendations = get_recommendations(tags)

    # return jsonify(recommendations)
    return jsonify(tags)

if __name__ == '__main__':
    app.run()
