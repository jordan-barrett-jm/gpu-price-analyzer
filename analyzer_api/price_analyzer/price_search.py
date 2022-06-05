#Get GPU pricing data from r/hardware swap
#Built using Pushshift.io - https://github.com/pushshift/api

import requests
import json
import datetime
import re
import time


def priceSearch(gpu_name):
    price_data = []
    last = int(datetime.datetime.now().timestamp())
    r = r'(?<=\$)[\d\.,]+[\d\.]*'
    all_invalid = False
    while len(price_data) < 500 and not all_invalid:
        params = {
            "size": 100,
            "title": gpu_name,
            'before': last,
            'subreddit': "hardwareswap"
        }
        print(params['title'])
        time.sleep(1)
        req_data = requests.get("https://api.pushshift.io/reddit/search/submission/", params=params).json()
        print ("-------------------------------------------------------------------------------")
        all_invalid = False
        invalid_count = 0
        for post in req_data["data"]:
            if len(price_data) < 500 and "selftext" in post:
                if "link_flair_text" in post and "[removed]" not in post["selftext"] and (gpu_name.upper() in post["title"] or gpu_name.lower() in post["title"]):
                    #ensure the post is not for a laptop
                    laptop_presence_title = len(re.findall(r'(laptop|LAPTOP|Laptop)', post['title']))
                    laptop_presence_body = len(re.findall(r'(laptop|LAPTOP|Laptop)', post['selftext']))
                    if (laptop_presence_title == 0 and laptop_presence_body == 0):
                        if post["link_flair_text"] == "SELLING":
                            match = re.findall(r, post['selftext'])
                            try:
                                if len(match) == 1:
                                    post_data = {
                                        'author': post['author'],
                                        'post_title': post['title'],
                                        'post_body': post['selftext'],
                                        'link': post['full_link'],
                                        'created_date': post["created_utc"],
                                        'price': float(match[0].replace(',',''))
                                    }
                                    price_data.append(post_data)
                            except Exception as e:
                                print(e)
                else:
                    invalid_count += 1
            else:
                break
        if invalid_count == len(req_data["data"]):
            all_invalid = True
        try:
            last = req_data["data"][-1]["created_utc"]           
        except Exception as e:
            break

    return price_data