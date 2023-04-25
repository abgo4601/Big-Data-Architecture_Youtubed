import openai
import os
import json
from dotenv import load_dotenv
load_dotenv()


def get_recommendations():
    openai.api_key = os.getenv("OPENAI_API_KEY")

    tags = ["medical school",
          "medical student",
          "med student",
          "premed",
          "rachel southard",
          "med school",
          "herd",
          "residency",
          "physician",
          "NRMP",
          "match",
          "match 2023",
          "obgyn",
          "study"]

    model_engine = "text-davinci-003"
    prompt = f"Recommend me names of top 15 TV shows, movies that are listed on IMDB and songs listed on Spotify based on the following tags: {tags}. Return the response in json format with having keys as shows, movies, songs"

    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.8,
    )

    return response.choices[0].text

if __name__ == "__main__":

    recommendations = get_recommendations()
    sections = recommendations.split("\n\n")

    
    print(sections[1])

    json_data = json.loads(sections[1])

    print(json_data["shows"])