var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
	// Let's scrape Anchorman 2
	console.log(req);
	var json;
	var query = req._parsedUrl.query;
	url = 'http://www.urbandictionary.com/define.php?term='+query;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var json = { title : "", audio : "",query: query};

			$('a.word').filter(function(){
				json.title = $(this).text();
		    })
		    $('a.play-sound').filter(function(){
		    	var audio = $(this)[0].attribs['data-urls'];
		    	console.log(audio); 
		        json.audio = audio;
		    });
		};
        res.send(JSON.stringify(json, null, 4))
	})
})

app.listen('8081');
exports = module.exports = app; 	