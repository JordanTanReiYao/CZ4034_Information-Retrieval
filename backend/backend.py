from flask import Flask, make_response, request,jsonify,json
from flask_cors import CORS, cross_origin
import pysolr
import os
import time
import datetime
from dateutil.parser import parse,isoparse
from dateutil.tz import *
import pytz

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)

solr = pysolr.Solr("http://localhost:8983/solr/tweets", always_commit=True)


@app.route('/get_results',methods=['GET'])
def get_results():
    query=request.args.get('query',type=str)
    field=request.args.get('field',type=str)
    numResults=request.args.get('numResults',type=int)
    sortBy=request.args.get('sortBy',type=str)
    sortOrder=request.args.get('sortOrder',type=str)
    search_results = solr.search(query,df=field,sort="{} {}".format(sortBy,sortOrder),rows=numResults)
    numDocs=search_results.raw_response['response']['numFound']
    docs=[{"username":doc['username'][0],"acctdesc":doc['acctdesc'][0],"location":doc['location'][0],
    "following":doc["following"][0],"followers":doc["followers"][0],"totaltweets":doc["totaltweets"][0],
    "usercreatedts":datetime.datetime.strftime(isoparse(doc["usercreatedts"][0]).astimezone(pytz.timezone('Asia/Singapore')),"%Y-%m-%d %H:%M:%S %z" ),
    "tweetcreatedts":datetime.datetime.strftime(isoparse(doc["tweetcreatedts"][0]).astimezone(pytz.timezone('Asia/Singapore')),"%Y-%m-%d %H:%M:%S %z" ),
    "retweetcount":doc["retweetcount"][0],"favoritecount":doc["favoritecount"][0],"text":doc["text"][0]} for doc in search_results.raw_response['response']['docs']]
    suggestions=search_results.raw_response['spellcheck']['suggestions']
    return jsonify(numDocs=numDocs,docs=docs,suggestions=suggestions)

    
if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)