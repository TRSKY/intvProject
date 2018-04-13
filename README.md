# Related Tweet Finder

Searches for the latest news articles returned with the Bing API, and finds the 10 most popular tweets related to mentions returned by the Bing API for each article.

## Outline:

The user can search the Bing news API endpoint. S/he will only have access to the 10 first results. 
For each result, the user can “Get Tweets.” Tweets are queried from the Twitter search API using the “mentions” field returned by Bing API.
Our database stores the tweet as it is returned by the Bing API with an added “query_string” field. 
If tweets corresponding to our query already exist in our database, we look for the 100 newest tweets for the last tweet we saved. 
If there are no tweets corresponding to our query, we get the 100 most recent tweets that match our query. 
When we display tweets, we filter out re-tweets, sort them by retweet count, and display the 10 most retweeted tweets. 
If no tweet corresponds to our query, or the bing API did not return mentions, we tell the user there was “No mentions to relate to.”


## Function: 

### A word on the server: 
We are using Flask, npm and Webpack to power our server. 
All of the Javascript dependencies (React, Jquery, Babel, etc.) are imported via npm. 
Webpack bundles everything up into bundle.js to reduce our overhead on page load. 

### The API:  
Our API has 3 end points:
1.	"/" is a _GET_ method and serves our webpage. 
2. "/search" is a _POST_ method and relays our search query to the Bing API.
3. "/tweets" is a _POST_ method and handles our tweet queries.

Endpoints 1 and 2 are self-explanatory; however, endpoint 3 makes use of multiple helper functions. 

Here is how they interact.

When Endpoint 3 recieves a query, it checks our database for entries matching our query. check_for_tweet(query) handles the search and returns a cursor object.

The cursor is either empty or contains the most recent entry matching the query. 

If the cursor is empty, then we update our database starting with `last_id` set to zero.  

If the cursor is not empty, then we update our database starting with `last_id` set to the ID of the tweet found in our database. 

`last_id` is given to the Twitter API which only returns tweets more recent than the tweet with said _id_.

Finally, we read the database for the given query, filter out retweets and return the query as a JSON response to the front end. 

### The Database: 

We use MongoDB. All tweets are saved in the same table, with the same format as the Twitter API response. We only add a field: `query_string`.

### The Tweet Query: 

We build a string by concatenating the values of all the `mentions` found in the Bing API result.

### API keys: 

API keys are stored in a `keys.json` file which is not commited to git.
`keys.json` holds a JSON dictionary with the following form: `{"bing_key": the Bing key, "consumer_key": Twitter key, "consumer_secret": Twitter secret, "key": Twitter key, "secret": Twitter secret}`


## Limitations:

### For the search endpoint: 
We only display the 10 newest results. 

### For the tweets:
The mentions returned by the Bing API are sparse and hinder our ability to find tweets for every result.

The query we build to look for tweets is very specific, which creates a small result scope. 

We may have duplicate tweets, as one tweet can be stored multiple times, each time with a different `query_string` field.

We only get the 100 newest tweets. If the last ID we had for a query was 50 and there were 102 new tweets between the time of our two queries, then we will only get tweet IDs 52-152, and therefore miss two tweets. If those tweets are original tweets that were heavily retweeted subsequently, then we will display skewed data.


## Points of improvement:

-	We could build the query differently, or run multiple different queries for a web result, which would up our hit rate. 
-	We could get all the tweets since the last tweet stored in our database, to prevent holes in our data.
-	We could let the user ask for more than just the 10 first search results. 
-	We could use other data then the `mentions` returned by the Bing API to build our query, thus upping our hit rate as well. 


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


