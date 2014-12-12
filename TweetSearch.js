// global variable to handle timer on clickSearch function call
var handle;

// clickSearch function gets some parameters from ui using DOM and prepares parameters array for the query  
function clickSearch()
{
	// get new frequency value
	var timeFreq = document.getElementById('frequency').value * 1000;
	// call clearInterval to reset timer on search frequency
	clearInterval(handle);
	handle = setInterval(function(){ 
		clickSearch();	
	}, timeFreq);

	// get query string and get tweet count that user wants to get
	var query = document.getElementById('query').value;
	var tweetCount = document.getElementById('count').value;
	
	var params = {
        q: query,
        result_type: 'recent',
        show_user : 'true',
        rpp: tweetCount
    };
    // call funtion searchTwitter that makes ajax request to get json data from Twitter service
    searchTwitter(params);
}

// searchTwitter function creates an ajax request to get json data for given query and appends the results to page
function searchTwitter(query) {
    $.ajax({ 
        url: 'http://search.twitter.com/search.json?' + jQuery.param(query),
        dataType: 'jsonp',
        success: function(data) {
			var tweets = $('#tweets');
			if(data['results'].length <1)
			{
				tweets.empty();
				tweets.append('<h1 id="noTweet">No tweets found</h1>');
			}
			else {
				tweets.empty();
				for (res in data['results']) {
					var text = data['results'][res]['text'];
					text = linkify_tweet(text);
					var html = '<div class="tweet"><div class="tweet-left"><a target="_blank" href="http://twitter.com/'+
						data['results'][res]['from_user']+'"><img width="64" height="64" alt="'+data['results'][res]['from_user']+
						' on Twitter" src="'+data['results'][res]['profile_image_url']+'" /></a></div>' +'<p><b>' +
						data['results'][res]['from_user_name'] + '</b> <a href="http://www.twitter.com/'+data['results'][res]['from_user']+
						'" target="_blank">@'+ data['results'][res]['from_user']+'</a>'+
						' (' +  data['results'][res]['created_at']+ ')<br />' +  text  + '</p></div><br />';
					$(html).hide().appendTo(tweets).fadeIn(500);
				}
			}
        }    
	});
}
// linkify_tweet function makes links, tags and hashtags navigatable
function linkify_tweet(html) {
	var tweet = html.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
		var wrap = document.createElement('div');
		var anch = document.createElement('a');
		anch.href = url;
		anch.target = "_blank";
		anch.innerHTML = url;
		wrap.appendChild(anch);
		return wrap.innerHTML;
	});
	tweet = tweet.replace(/(^|\s)@(\w+)/g, '$1<a href="http://www.twitter.com/$2" target="_blank">@$2</a>');
	return tweet.replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>');
};   

// StopRefreshing function handles the checkbox that says "Stop refreshing ..." 
// so this function stops timer or starts it again
function StopRefreshing(checked)
{
	if(checked)
	{
		clearInterval(handle);
	}
	else {
		// x seconds frequently refreshing of query
		var timeFreq = document.getElementById('frequency').value * 1000;
		
		handle = setInterval(function(){ 
			clickSearch();	
		}, timeFreq);
	}
}
