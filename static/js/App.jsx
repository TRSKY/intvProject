import React from "react";

export default class App extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {title: "Realted Tweet Finder", value: ""};
	    this.testTwitter = this.testTwitter.bind(this)
	    this.handleSearchChange = this.handleSearchChange.bind(this)
	    this.submitSearch = this.submitSearch.bind(this)

  	}
  	testTwitter(e) {
  		
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
	render () {
		return (
			<div className="page">
				<div className="container">
					<h1 className="title">{this.state.title}</h1>
				</div>
				<div className="button" onClick={this.testTwitter}>Twitter Test Button</div>
				<div className="search-container">
					<input type="text" placeholder="Enter Query" value={this.state.value} className="search-input" onChange={this.handleSearchChange}/>
					<input type="submit" className="submit-button" onClick={this.submitSearch} value="Submit"/> 
				</div>
				<div className="result-container">
					{this.state.hasResult ? 
						this.state.response.map(function(item, i) {
							return <SearchResult index={i} url={item.url} mentions={item.mentions} headline={item.name} description={item.description} img_src={item.image.thumbnail.contentUrl}/>
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
	    this.state = {tweets: []}
	}
	getTweets() {
		// parse the mentions
		// build a query out of them 
		// send them to the server to get the tweets
		e.preventDefault()
		console.log("we get tweets")
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
		    	this.setState({tweets: JSON.parse(status)})
		    }.bind(this)
  		})
	}
	render () {
		return (
			<div className='result' key={this.props.index}>
				<div className="search-result">
					<img src={this.props.img_src} className="result-image"/>
					<div className="meta">
						<a href={this.props.url} target="_blank"><h3 className="headline">{this.props.headline}</h3></a>
						<p className="description">{this.props.description}</p>
					</div>
				</div>
				<button className="get-tweet-button" onClick={this.getTweets}>Get Tweet</button>
				<div className="tweet-container">

				</div>
			</div>
		)
	}
}