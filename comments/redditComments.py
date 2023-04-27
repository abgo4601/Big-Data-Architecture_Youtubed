from flask import Flask, request, Response
import json
import platform
import io, os, sys
import hashlib, requests
import logging
import logging as log
import time
from elasticsearch import Elasticsearch

log.basicConfig(format='%(asctime)s:%(levelname)s:%(message)s', level=logging.DEBUG)               
# Password for the 'elastic' user generated by Elasticsearch
ELASTIC_PASSWORD = "JLuHzd3N58xmJ8fBdmTYYW3e"

# Found in the 'Manage Deployment' page
CLOUD_ID = "youtubed:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRlNmU4YzMyYTljNzI0ZjMyYmI0MzVhN2ZjZGQxNGFlNCQ4ODczZDUyMDA0NjI0OTZhOTNmNmQzMjgzMzYyYzZlZg=="

# Create the client instance
client = Elasticsearch(
    cloud_id=CLOUD_ID,
    basic_auth=("elastic", ELASTIC_PASSWORD)
)

BASE_URL = 'https://api.pushshift.io'
# Initialize the Flask application
app = Flask(__name__)

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

# start flask app
app.run(host="0.0.0.0", port=5000)