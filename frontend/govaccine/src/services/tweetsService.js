import http from "../http-common";

class TweetsDataService{
    getTweets(query,numResults,sortBy,sortOrder,sentiment, field = "text")
    {
        return http.get(`get_results?query=${query}&field=${field}&numResults=${numResults}&sortBy=${sortBy}&sortOrder=${sortOrder}&sentiment=${sentiment}`);
    }

    postFile(file)
    {

          console.log(3345,file.get('file1'))
        return http.post('/upload',file)
    }
}

export default new TweetsDataService();