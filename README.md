# Related Tweet Finder

Search for the latest news articles returned with the Bing API, and find 10 most popular tweets related to mentions returned by the Bing API for each article.

## Outline:

The user can search the Bing news API endpoint. He will only have access to the 10 first results. 
For each result, the user can `Get Tweets`. Tweets are queried from the twitter search API using the `mentions` field returned by Bing API.
Our database stores the tweet as it is returned by the Bing API with an added `query_string` field. 
If tweets corresponding to our query already exist in our database, we look for the 100 tweets that are newer than the last tweet we saved. 
If there are no tweets corresponding to our query, we get the 100 most recent tweets that match our query. 
When we display tweets, we filter our re-tweets, sort them by retweet count, and display the 10 most retweeted tweets. 
If no tweet corresponds to our query, or the bing API did not return mentions, we tell the user there was `No mentions to relate to`.


## Function: 

Our API has 3 end points: 



## Limitations:



## Points of improvement:


## Setup Commands:
### Should be run in the static folder: 
-   npm init
-   npm i webpack --save-dev
-	npm i babel-core babel-loader babel-preset-env babel-preset-react --save-dev
-	npm i react react-dom --save-dev
- 	npm i react-tweet --save-dev

### To get MongoDB going:
-	pip install flask
-	pip install Flask-PyMongo
	
### To interact with the Twitter API:
-	pip install oauth2


