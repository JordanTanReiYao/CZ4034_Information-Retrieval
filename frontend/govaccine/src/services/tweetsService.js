import http from "../http-common";

class TweetsDataService{
    getTweets(query,numResults,sortBy,sortOrder, field = "text")
    {
        return http.get(`get_results?query=${query}&field=${field}&numResults=${numResults}&sortBy=${sortBy}&sortOrder=${sortOrder} `);
    }
}

export default new TweetsDataService();