import json
import os
from flask import Flask, render_template, request, redirect, url_for, abort, Response
from flask_pymongo import PyMongo
import urllib
import urllib2
import oauth2
import requests
from bson.json_util import dumps
import time #to test the loading wheel reliably 



app = Flask(__name__)
mongo = PyMongo(app)

TARGET_TWITTER_URL = "https://api.twitter.com/1.1/search/tweets.json"

@app.route("/", methods=['GET'])
def index():
	return render_template('index.html')

@app.route("/search", methods=['POST'])
def search():
	#hits the microsoft search endpoint
	search_term = json.loads(request.form["queryString"])["query"]
	search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
	headers = {"Ocp-Apim-Subscription-Key" : bing_key()}
	params  = {"q": search_term}
	response = requests.get(search_url, headers=headers, params=params)
	response.raise_for_status()
	search_results = response.json()
	print search_results["value"]
	return json.dumps(search_results["value"])

@app.route("/tweets", methods=["POST"])
def get_tweets(): #the query should be a list of key words
	#checks if the query has been done
	query = json.loads(request.form["queryString"])["query"]		
	last_tweet_cursor = check_for_tweet(query)
	if last_tweet_cursor.count() > 0:
		print "we found an existing tweet"
		last_id = last_tweet_cursor[0]["id_str"]
		did_update(last_id, query)
	else:
		did_update("0", query)
	matching_tweet_cursor = get_tweets_from_db(query)
	return dumps(matching_tweet_cursor)

def check_for_tweet(query):
	#returns the cursor object that will have the last tweet or be empty
	ans = mongo.db.tweets.find({"query_string": query, "retweeted_status": { "$exists" : False }}).sort("id", -1 ).limit(1)
	return ans


def get_key_secret(): #if we store our key and secret differently we can just change this function
	consumer_key = None
	consumer_secret = None
	key = None
	secret = None
	with open("keys.json", 'r') as f:
		key_secret_dict = json.loads(f.read())
		key = key_secret_dict["key"]
		secret = key_secret_dict["secret"]
		consumer_key = key_secret_dict["consumer_key"]
		consumer_secret = key_secret_dict["consumer_secret"]
	return key, secret, consumer_key, consumer_secret

def bing_key():
	bing_key = None
	with open("keys.json", 'r') as f:
		key_secret_dict = json.loads(f.read())
		bing_key = key_secret_dict["bing_key"]
	return bing_key


def did_update(id_, query): #returns a boolean #both inputs are strings
	#checks if we have tweets newer than the input id 
	#upates our records if we do
	print id_
	values = {'q': query,
          'result_type': 'recent',
          'count': '100', 
          'since_id': id_}

  	query_string = urllib.urlencode(values)
	url = TARGET_TWITTER_URL + "?" + query_string

	key, secret, consumer_key, consumer_secret = get_key_secret()

	results = oauth_req(url, key, secret, consumer_key, consumer_secret)
	parsed_results = json.loads(results)
	found_tweets = parsed_results["statuses"]
	if len(found_tweets) > 0:
		for el in found_tweets:
			el["query_string"] = query

		mongo.db.tweets.insert(found_tweets)
		print "we inserted"
		return True
	else:
		print "we don't insert"
		return False

def get_tweets_from_db(query): #reads query in the db
	return mongo.db.tweets.find({"query_string": query, "retweeted_status": { "$exists" : False }}).sort("retweet_count", -1).limit(10)

def oauth_req(url, key, secret, consumer_key, consumer_secret, http_method="GET", post_body="", http_headers=None): #returns?
    consumer = oauth2.Consumer(consumer_key, consumer_secret)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request( url, method=http_method, body=post_body, headers=http_headers )
    return content


@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404

if __name__ == "__main__":
    app.run(debug=True) # local running on port 5000
    #app.run(host='0.0.0.0', port=8080, debug=False)
