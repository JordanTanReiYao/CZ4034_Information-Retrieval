from flask import Flask,request,jsonify
from flask_cors import CORS
import pysolr
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
    params={}
    query=request.args.get('query',type=str)
    params['df']=request.args.get('field',type=str)
    numResults=request.args.get('numResults',type=str)
    if numResults!='all':
        params['rows']=int(numResults)

    sortBy=request.args.get('sortBy',type=str)
    sortOrder=request.args.get('sortOrder',type=str)

    if sortBy!='relevance':
        params['sort']="{} {}".format(sortBy,sortOrder)

    queryItems=query.split()
    if len(queryItems)>1 and not 'AND' in queryItems and not 'OR' in queryItems:
        query="\""+query+"\""

    start=time.time()
    search_results = solr.search(query,**params)
    queryTime=round(time.time()-start,3)

    numDocs=search_results.raw_response['response']['numFound']
    
    docs= search_results.raw_response['response']['docs']
    for doc in docs:
        doc.update((k, datetime.datetime.strftime(isoparse(v).astimezone(pytz.timezone('Asia/Singapore')),"%Y-%m-%d %H:%M:%S %z" )) for k, v in doc.items() if k == "usercreatedts" or k=='tweetcreatedts')

    suggestions=search_results.raw_response['spellcheck']['suggestions'] if 'spellcheck' in search_results.raw_response else []
    return jsonify(queryTime=queryTime,numDocs=numDocs,docs=docs,suggestions=suggestions)

    
if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)