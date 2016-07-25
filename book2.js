// FAVORITE!!! http://maxogden.com/scraping-with-node.html

// Probably a good one!
// https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping

var fs = require('fs')
var $ = require('cheerio')
var request = require('request')
var pictureTube = require('picture-tube')

var downloadFile = function(url) {
  	console.log('downloading...' + url)
  	
	var idx = url.lastIndexOf('/')
	if (idx > 0) {
		var resourceName = url.substring(idx+1)
		
		console.log('downloading... ' + resourceName)
		var stream = fs.createWriteStream('images/' + resourceName)
		request
			.get(url)
			.on('error', function(err) {
				console.log(err)
			})
			.pipe(stream)
		// working? Not really! Some bug in the pipe? or createStream
	}
}

var DOMAIN = 'http://substack.net';

function gotHTML(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  // get all img tags and loop over them
  var imageURLs = []
  parsedHTML('a').map(function(i, link) {
    var href = $(link).attr('href')
    if (!href.match('.png')) return
    imageURLs.push(DOMAIN + href)
  });

  var randomIndex = Math.floor(Math.random() * imageURLs.length)
  var randomImage = imageURLs[randomIndex]
  console.log('Displaying... ' + randomImage)
  request(randomImage).pipe(pictureTube()).pipe(process.stdout)	

  // imageURLs.forEach(function(url) {
  // 	downloadFile(url);
  // })
}

var bookPathUrl = 'http://www.goethe-verlag.com/book2/EN/ENLT/';

var getTopicPage = function(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)

  console.log('getTopicPage')  
  // var words = []
  // var sounds = []
  
  var sel = 'audio > source'
  parsedHTML(sel).each(function(i, audio) {
    var $audio = $(audio)
    var src = $audio.attr('src')
    console.log('adding... ' + src)

    var columns = $audio.parent().parent().siblings();

    var english = $(columns[0]).text();
    var lithuanian;

    $(columns[1]).children().each(function(i, child) {
      if (i == 1) {
        lithuanian = $(child).text();
      }
    })

    console.log(english, lithuanian, src)
  })
}

var processTopic = function(relativeUrl) {
  var url = bookPathUrl + relativeUrl;
  console.log(url);
  request(url, getTopicPage)
}

var getIndex = function(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  var topicLinks = []
  // var sel = 'div.Styl39 > a'
  // var sel = 'div.col-md-4 > a'
  var sel = 'div.col-md-4 > div > a'

  parsedHTML(sel).each(function(i, link) {
    var href = $(link).attr('href')
    // console.log('adding... ' + href)
    topicLinks.push(href)
  })

  // topicLinks.forEach(function(url) {
  //   processTopic(url)
  // })

  processTopic(topicLinks[0]);
}

var bookIndexUrl = bookPathUrl + 'ENLT002.HTM';

request(bookIndexUrl, getIndex)
