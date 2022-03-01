import React, { useState, useEffect } from "react";
import tweetsService from "../services/tweetsService";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export default function TweetList() {
  // const [tweets, setTweets] = useState();
  const [tweets, setTweets] = useState([]);
  let { queryParam } = useParams();
  const [query, SetQuery] = React.useState();

  useEffect(() => {
    SetQuery(queryParam || "");
    console.log(queryParam);
    retrieveTweets(queryParam, 10, "tweetcreatedts", "desc");
  }, [queryParam]);

  const retrieveTweets = (query, numResults, sortBy, sortOrder) => {
    tweetsService
      .getTweets(query, numResults, sortBy, sortOrder)
      .then((response) => {
        console.log(response.data);
        setTweets(response.data.docs);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //   const retrieveTweets = () => {
  //     setTweets([
  //       { username: "Ford", text: 15000 , key:1},
  //       { username: "toyota", text: 12000 , key:2 },
  //       { username: "Rover", text: 14000 , key:3 }
  //     ]);
  //     console.log(tweets);
  //   };
  return (
    <div className="row m-5">
      <div className="col-2">
          <div className="FilterPanel">Filter placeholder</div>
      </div>
      <div className="col-10">
        {tweets.map((tweet) => {
          return (
            <Card sx={{ minWidth: 275 }} variant="outlined">
              <CardContent>
                <div className="row">
                  <div className="col-1 align-middle">
                    <Avatar src="/broken-image.jpg" />
                  </div>

                  <div className="col-8 text-start">
                    <div>
                      
                      {tweet.username} -&nbsp;
                      <label className="TweetDateLabel">
                        {tweet.tweetcreatedts}
                      </label>
                    </div>
                    <div> {tweet.text}</div>
                  </div>
                  <div className="col-3 ">
                    <label>Sentiment placeholder</label>
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
        <br />
        <div className="ml-auto">
          <Pagination count={10} color="primary" />
        </div>
      </div>
    </div>
  );
}
