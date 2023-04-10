from flask import Flask, jsonify,redirect,url_for,render_template,request
from flask.globals import request
from werkzeug.exceptions import abort
from werkzeug.utils import redirect

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

from googleapiclient.discovery import build

import openai
import os
import pickle

app = Flask(__name__,template_folder='templates')

def login_is_required(function):
    def wrapper(*args,**kwargs):
        encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
        if encoded_jwt==None:
            return abort(401)
        else:
            return function()
    return wrapper

@app.route('/')
def index():
    return app.send_static_file('index.html')

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

    print(credentials)
    return credentials

def get_liked_videos():
    credentials = authenticate_youtube()

    youtube = build('youtube', 'v3', credentials=credentials)

    results = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        myRating='like', maxResults=25
    ).execute()

    return results


# def get_recommendations(tags):
#     openai.api_key = os.getenv("OPENAI_API_KEY")

#     model_engine = "text-davinci-003"
#     prompt = f"Recommend me top 15 TV shows, movies, podcasts along with their countries based on the following tags: {tags}"

#     response = openai.Completion.create(
#         engine=model_engine,
#         prompt=prompt,
#         max_tokens=1024,
#         n=1,
#         stop=None,
#         temperature=0.8,
#     )

#     return response.choices[0].text

@app.route('/youtube_tags')
def youtube_tags():
    results = get_liked_videos()
    print(results)

    videos_list = []

    video_tags = []

    for item in results["items"]:
        item_snippet = item["snippet"]
        if 'tags' in item["snippet"].keys():
            for t in item["snippet"]["tags"]:
                if t not in video_tags:
                    video_tags.append(t)

    print(video_tags)
 
    # recommendations = get_recommendations(video_tags)

    # return jsonify(recommendations)
    # return jsonify(video_tags)

if __name__ == '__main__':
    app.run()
