from flask import Flask, jsonify

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from googleapiclient.discovery import build

import openai
import os

app = Flask(__name__)

def authenticate_youtube():
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secrets.json',
        scopes=['https://www.googleapis.com/auth/youtube.readonly']
    )
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
