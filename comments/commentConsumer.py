import json
from confluent_kafka import Consumer
from elasticsearch import Elasticsearch# Required connection configs for Kafka producer, consumer, and admin

def read_ccloud_config(config_file):
    conf = {}
    with open(config_file) as fh:
        for line in fh:
            line = line.strip()
            if len(line) != 0 and line[0] != "#":
                parameter, value = line.strip().split('=', 1)
                conf[parameter] = value.strip()
    return conf

props = read_ccloud_config("client.properties")
props["group.id"] = "python-group-1"
props["auto.offset.reset"] = "earliest"

ELASTIC_PASSWORD = "JLuHzd3N58xmJ8fBdmTYYW3e"

# Found in the 'Manage Deployment' page
CLOUD_ID = "youtubed:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRlNmU4YzMyYTljNzI0ZjMyYmI0MzVhN2ZjZGQxNGFlNCQ4ODczZDUyMDA0NjI0OTZhOTNmNmQzMjgzMzYyYzZlZg=="

# Create the client instance
client = Elasticsearch(
    cloud_id=CLOUD_ID,
    basic_auth=("elastic", ELASTIC_PASSWORD)
)

consumer = Consumer(props)
print('Available topics to consume: ', consumer.list_topics().topics)
consumer.subscribe(["youtubed"])
try:
    while True:
      msg = consumer.poll(1.0)
      if msg is None:
            continue
      if msg.error():
            print('Error: {}'.format(msg.error()))
            continue
      data=json.loads(msg.value().decode('utf-8'))
      client.index(
          index='reddit-comments',
          document={
              'search_term': data.get('term'),
              'comment': data.get('comment'),
              'timestamp': data.get('timestamp')
          })
      print(data.get('comment'))
except KeyboardInterrupt:
         pass
finally:
         consumer.close()

         