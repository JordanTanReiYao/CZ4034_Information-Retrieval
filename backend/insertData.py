import pandas as pd
import pysolr
import requests
from collections import deque
url = 'http://localhost:8983/solr/admin/cores?action=STATUS&core=tweets'

resp = requests.get(url=url )
index=resp.json()['status']['tweets']['index']['numDocs']

tweets = pd.read_csv('CZ4034_Labelled_Tweets.csv', dtype={'id': str,'following':int,'followers':int,"totaltweets":int,
                                                "retweetcount":int,"favoritecount":int,"acctdesc":str},encoding='utf-8')

data=[]
for _,row in tweets.iterrows():
    data.append({"id":index,"username":row['username'],"image_url":row['image_url'],"acctdesc":row['acctdesc'] ,"location":row['location'],
"following":row["following"],"followers":row["followers"],"totaltweets":row["totaltweets"],
"usercreatedts":row['usercreatedts'],"tweetcreatedts":row["tweetcreatedts"],"retweetcount":row["retweetcount"],
"favoritecount":row["favoritecount"],"text":row["text"],'sentiment':row['sentiment']})
    index+=1


solr = pysolr.Solr("http://localhost:8983/solr/tweets", always_commit=True)
print("Add data to Solr:")
print(solr.add(data))

query_search = "vaccine"

search_results = solr.search("vaccine",sort='followers asc',df='text',rows=300)


print(search_results.raw_response['response']['docs'])