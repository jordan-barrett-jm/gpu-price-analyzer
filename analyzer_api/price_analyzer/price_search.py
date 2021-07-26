#Get GPU pricing data from r/hardware swap
#Built using Pushshift.io - https://github.com/pushshift/api

import requests
import json
from pprint import pp


def priceSearch(gpu_name):
    params = {
        "size": 10,
        "title": gpu_name
    }
    price_data = []

    while len(price_data) < 5:
        req_data = requests.get("https://api.pushshift.io/reddit/search/submission/", params=params)


        for post in req_data.json()["data"]:
            if "link_flair_text" in post:
                if post["link_flair_text"] == "SELLING":
                    post_data = {
                        'author': post['author'],
                        'post_title': post['title'],
                        'post_body': post['selftext'],
                        'link': post['full_link']
                    }
                    price_data.append(post_data)
                    

    return price_data