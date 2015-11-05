var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res,next){
	var query = req._parsedUrl.query;
	url = 'http://www.urbandictionary.com/define.php?term='+query;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var json = { title : "", audio : "",query: query, definition:""};

			$('a.word').filter(function(){
				json.title = $(this).text();
		    });
		    $('.meaning').first().filter(function(){
				json.definition = $(this).text();
		    });
		    $('a.play-sound').filter(function(){
		    	var audio = $(this).data('urls');
		        json.audio = audio;
		    });
		};
        res.send(JSON.stringify(json, null, 4))
	})
})

app.listen('8081');
exports = module.exports = app; 	