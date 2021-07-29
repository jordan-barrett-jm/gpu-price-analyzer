#Get GPU pricing data from r/hardware swap
#Built using Pushshift.io - https://github.com/pushshift/api

import requests
import json
from pprint import pp
import datetime
import re


def priceSearch(gpu_name):
    price_data = []
    last = int(datetime.datetime.now().timestamp())
    r = r'\$[-0-9.,]+[-0-9.,a-zA-Z]*\b'
    while len(price_data) < 5:
        params = {
            "size": 100,
            "title": gpu_name,
            'before': last
        }
        req_data = requests.get("https://api.pushshift.io/reddit/search/submission/", params=params).json()
        print ("-------------------------------------------------------------------------------")
        
        for post in req_data["data"]:
            if len(price_data) < 5:
                if "link_flair_text" in post and "[removed]" not in post["selftext"]:
                    #print (post)
                    if post["link_flair_text"] == "SELLING":
                        match = re.findall(r, post['selftext'])
                        if len(match) == 1:
                            post_data = {
                                'author': post['author'],
                                'post_title': post['title'],
                                'post_body': post['selftext'],
                                'link': post['full_link']
                            }
                            price_data.append(post_data)
            else:
                break
        last = req_data["data"][-1]["created_utc"]           

    return price_data