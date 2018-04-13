import React from "react";
import Tweet from 'react-tweet'

export default class App extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {title: "Related Tweet Finder", value: ""};
	    this.handleSearchChange = this.handleSearchChange.bind(this)
	    this.submitSearch = this.submitSearch.bind(this)

  	}
  	handleSearchChange(e) {
  		e.preventDefault()
  		this.setState({value: e.target.value})
  	}
  	submitSearch(e) {
  		e.preventDefault()
  		// do some ajax request
  		var form = new FormData()
		var formJson = {query: this.state.value, hasResult: false, response: []}
		form.append("queryString", JSON.stringify(formJson))
  		$.ajax({
  			type: 'POST',
		    url: '/search',
		   	contentType: false,
		   	processData: false,
		    data: form,
		    success: function(status) {
		    	this.setState({hasResult: true, response: JSON.parse(status)})
		    }.bind(this)
  		})
  	}
  	getImage(item) {
  		var image_dict = item.image
  		if (item.image) {
  			var thumbnail_dict = image_dict.thumbnail
  			if (thumbnail_dict) {
  				return thumbnail_dict.contentUrl
  			} 
  		}
  		return "/static/img/placeholder.png"
  	}
	render () {
		return (
			<div className="page">
				<div className="container">
					<h1 className="title">{this.state.title}</h1>
				</div>
				<form className="search-container" onSubmit={this.submitSearch}>
					<input type="text" placeholder="Enter Query" value={this.state.value} className="search-input" onChange={this.handleSearchChange}/>
				</form>
				<div className="result-container">
					{this.state.hasResult ? 
						this.state.response.map(function(item, i) {
							return <SearchResult key={i} url={item.url} mentions={item.mentions} headline={item.name} description={item.description} img_src={this.getImage(item)}/>
						}.bind(this)) 
						:
						null
					}
				</div>
			</div>
		)
	}
}
class SearchResult extends React.Component {
	constructor(props) {
	    super(props);
	    this.getTweets = this.getTweets.bind(this)
	    this.state = {tweets: [], hasTweets: true, showTweets: false, headline: this.props.headline}
	}
	getTweets(e) {
		// parse the mentions
		// build a query out of them 
		// send them to the server to get the tweets
		e.preventDefault()
		console.log("we get tweets")
		console.log(this.props.mentions)
		if (!this.props.mentions) {
			this.setState({hasTweets: false, showTweets: false})
			return
		} 
		console.log("we come here")
		var mentionList = this.props.mentions.map(function(item, i) {return item.name})
		var query = mentionList.join(" ")
  		var form = new FormData()
		var formJson = {query: query}
		form.append("queryString", JSON.stringify(formJson))
  		$.ajax({
  			type: 'POST',
		    url: '/tweets',
		   	contentType: false,
		   	processData: false,
		    data: form,
		    success: function(status) {
		    	var found_tweets = JSON.parse(status)
		    	if (found_tweets.length === 0) {
		    		this.setState({hasTweets: false, showTweets: true})
		    	} else {
		    		this.setState({tweets: JSON.parse(status), hasTweets: true, showTweets: true})
		    	}
		    	
		    }.bind(this)
  		})
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.headline !== prevState.headline) {
			return {tweets: [], hasTweets: true, showTweets: false}
		} else {
			return null
		}
	}
	render () {
		const linkProps = {target: '_blank', rel: 'noreferrer'}
		return (
			<div className='result'>
				<div className="search-result">
					<img src={this.props.img_src} className="result-image"/>
					<div className="meta">
						<a href={this.props.url} target="_blank"><h3 className="headline">{this.props.headline}</h3></a>
						<p className="description">{this.props.description}</p>
						<button className="get-tweet-button" onClick={this.getTweets}>Get Tweets</button>
					</div>
				</div>
					{this.state.hasTweets ? <div className={this.state.showTweets ? "tweet-container": "tweet-container hidden"}>
						{this.state.tweets.map(function(item, i) {
							return <Tweet key={i} data={item} linkProps={linkProps} />
						}.bind(this)) }
						</div> :
						<p> No mentions to relate to </p>
					}
			</div>
		)
	}
}