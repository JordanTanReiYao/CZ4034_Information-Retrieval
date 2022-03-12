from tweepy import OAuthHandler
import tweepy
import pandas as pd

# Twitter credentials
# Obtain them from your twitter developer account
consumer_key = "x3uyBQZvgTJGeiPpiV1LVhNCv"
consumer_secret = "cvqn6nai87L44MkJYpkp0uUBxmhQSp8CwjzEjYcyEGVTDVX5zp"
access_key = "1448234734690050054-whQXA02vu3sbT5wZQyIkGIgKkCNKAd"
access_secret = "9mSljxBv1YfYt19WQ1Hx3SqDm10LajnrnugrjLkQcWjtf"
# Pass your twitter credentials to tweepy via its OAuthHandler
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_key, access_secret)
api = tweepy.API(auth,wait_on_rate_limit=True)

## Function to scrape tweets
def scraptweets(search_words, numTweets):    
    # Define a pandas dataframe to store the date:
    db_tweets = pd.DataFrame(columns = ['username', 'acctdesc', 'location', 'following',
                                        'followers', 'totaltweets', 'usercreatedts', 'tweetcreatedts',
                                        'retweetcount','favoritecount', 'text', 'hashtags'])
    
    # Scrape tweets using the Cursor object
    # .Cursor() returns an object that you can iterate or loop over to access the data collected.
    # Each item in the iterator has various attributes that you can access to get information about each tweet
    tweets = tweepy.Cursor(api.search_tweets, q=search_words, lang="en",\
        tweet_mode='extended').items(numTweets)


    # Store these tweets into a python list
    tweet_list = [tweet for tweet in tweets]
    # Obtain the following info (methods to call them out):
    # user.screen_name - twitter handle
    # user.description - description of account
    # user.location - where is he tweeting from
    # user.friends_count - no. of other users that user is following (following)
    # user.followers_count - no. of other users who are following this user (followers)
    # user.statuses_count - total tweets by user
    # user.created_at - when the user account was created
    # created_at - when the tweet was created
    # retweet_count - no. of retweets of the tweet
    # favorite_count - np. of favorites of the tweet
    # retweeted_status.full_text - full text of the tweet
    # entities['hashtags'] - hashtags in the tweet
    noTweets = 0
    for tweet in tweet_list:
        username = tweet.user.screen_name
        acctdesc = tweet.user.description
        location = tweet.user.location
        following = tweet.user.friends_count
        followers = tweet.user.followers_count
        totaltweets = tweet.user.statuses_count
        usercreatedts = tweet.user.created_at
        tweetcreatedts = tweet.created_at
        retweetcount = tweet.retweet_count
        favorite_count=tweet.favorite_count
        hashtags = tweet.entities['hashtags']
        text=tweet.full_text.encode('ascii','ignore').decode('ascii')
        ith_tweet = [username, acctdesc, location, following, followers, totaltweets,
                        usercreatedts, tweetcreatedts, retweetcount,favorite_count, text, hashtags]
        db_tweets.loc[len(db_tweets)] = ith_tweet
        noTweets += 1
         
    db_tweets.drop_duplicates(subset='text',inplace=True)
    return db_tweets

# Define search keywords
search_words = "vaccine OR pfizer OR moderna OR biontech OR \
sinopharm OR booster+shot -filter:retweets exclude:replies exclude:links"
date_since = "2019-11-03"
numTweets = 25000

db=scraptweets(search_words,numTweets)

db.to_csv('CZ4034_Tweets.csv',index=False)