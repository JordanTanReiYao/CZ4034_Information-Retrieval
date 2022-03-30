from flask import Flask,request,jsonify
from flask_cors import CORS
import pysolr
import time
import datetime
from dateutil.parser import parse,isoparse
from dateutil.tz import *
import pytz
import pandas as pd
import requests

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['JSON_AS_ASCII'] = False
CORS(app)

solr = pysolr.Solr("http://localhost:8983/solr/tweets", always_commit=True)


@app.route('/get_results',methods=['GET'])
def get_results():
    params={}
    query=request.args.get('query',type=str)
    params['df']=request.args.get('field',type=str)
    numResults=request.args.get('numResults',type=str)
    sentiment=request.args.get('sentiment',type=str)
    if numResults!='all':
        params['rows']=int(numResults)

    sortBy=request.args.get('sortBy',type=str)
    sortOrder=request.args.get('sortOrder',type=str)

    if sortBy!='relevance':
        params['sort']="{} {}".format(sortBy,sortOrder)

    filter=[]
    if sentiment!='all':
        filter.append('sentiment:{}'.format(sentiment))

    queryItems=query.split()
    if len(queryItems)>1 and not 'AND' in queryItems and not 'OR' in queryItems:
        query="\""+query+"\""
    print(params)
    start=time.time()
    search_results = solr.search(query,**params,fq=filter)
    queryTime=round(time.time()-start,3)

    numDocs=search_results.raw_response['response']['numFound']
    
    docs= search_results.raw_response['response']['docs']
    for doc in docs:
        doc.update((k, datetime.datetime.strftime(isoparse(v).astimezone(pytz.timezone('Asia/Singapore')),"%Y-%m-%d %H:%M:%S %z" )) for k, v in doc.items() if k == "usercreatedts" or k=='tweetcreatedts')

    suggestions=search_results.raw_response['spellcheck']['suggestions'] if 'spellcheck' in search_results.raw_response else []
    return jsonify(queryTime=queryTime,numDocs=numDocs,docs=docs,suggestions=suggestions)


@app.route('/upload', methods=["GET", "POST"])
def index():
    print(23)
    print(request.files)
    print(len(request.files))
    tweets = pd.read_csv(request.files['file1'],dtype={'id': str,'following':int,'followers':int,"totaltweets":int,
                                                    "retweetcount":int,"favoritecount":int,"acctdesc":str},encoding='utf-8')
    url = 'http://localhost:8983/solr/admin/cores?action=STATUS&core=tweets'

    resp = requests.get(url=url )
    index=resp.json()['status']['tweets']['index']['numDocs']
    print(index)
    data=[]
    for _,row in tweets.iterrows():
        data.append({"id":index,"username":row['username'],"image_url":row['image_url'],"acctdesc":row['acctdesc'] ,"location":row['location'],
    "following":row["following"],"followers":row["followers"],"totaltweets":row["totaltweets"],
    "usercreatedts":row['usercreatedts'],"tweetcreatedts":row["tweetcreatedts"],"retweetcount":row["retweetcount"],
    "favoritecount":row["favoritecount"],"text":row["text"],'sentiment':row['sentiment']})
        index+=1

    print("Add data to Solr:")
    try:
        print(solr.add(data))
    except:
        return jsonify(message="Error Uploading!")
    return jsonify(message="Successfully Uploaded!")

    
if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)