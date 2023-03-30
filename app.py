from flask import Flask, jsonify,session,redirect,url_for,render_template,request

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

from googleapiclient.discovery import build

import openai
import os
import pickle

app = Flask(__name__,template_folder='templates')

"""
# Set up YouTube API client
scopes = ["https://www.googleapis.com/auth/youtube.force-ssl","https://www.googleapis.com/auth/youtube.readonly"]
flow = Flow.from_client_secrets_file("client_secret_4.json", scopes=scopes)
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

    credentials = None

    # token.pickle stores the user's credentials from previously successful logins
    if os.path.exists('token.pickle'):
        print('Loading Credentials From File...')
        with open('token.pickle', 'rb') as token:
            credentials = pickle.load(token)
    
    # If there are no valid credentials available, then either refresh the token or log in.
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            print('Refreshing Access Token...')
            credentials.refresh(Request())
        else:
            print('Fetching New Tokens...')
            flow = InstalledAppFlow.from_client_secrets_file(
            'client_secrets.json',
            scopes=[
                'https://www.googleapis.com/auth/youtube.readonly'
            ]
        )

        flow.run_local_server(port=8080, prompt='consent',
                              authorization_prompt_message='')
        credentials = flow.credentials

        # Save the credentials for the next run
        with open('token.pickle', 'wb') as f:
            print('Saving Credentials for Future Use...')
            pickle.dump(credentials, f)

 
    return credentials

def get_liked_videos():
    credentials = authenticate_youtube()

    youtube = build('youtube', 'v3', credentials=credentials)

    results = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        myRating='like', maxResults=25
    ).execute()

    return results


def get_recommendations(tags):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    model_engine = "text-davinci-003"
    prompt = f"Recommend me a TV show, movie, or podcast based on the following tags: {tags}"

    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5,
    )

    return response.choices[0].text

@app.route('/youtube_tags')
def youtube_tags():
    results = get_liked_videos()

    videos_list = []

    video_tags = []

    for item in results["items"]:
        item_snippet = item["snippet"]
        if 'tags' in item["snippet"].keys():
            for t in item["snippet"]["tags"]:
                if t not in video_tags:
                    video_tags.append(t)

 
    # recommendations = get_recommendations(tags)

    # return jsonify(recommendations)
    return jsonify(video_tags)

if __name__ == '__main__':
    app.run()
