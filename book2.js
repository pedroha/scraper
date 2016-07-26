// FAVORITE!!! http://maxogden.com/scraping-with-node.html

// Probably a good one!
// https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping

var fs = require('fs')
var $ = require('cheerio')
var request = require('request')
var pictureTube = require('picture-tube')

var downloadFile = function(url, folder) {
	console.log('downloading...' + url)
  	
	var idx = url.lastIndexOf('/')
	if (idx > 0) {
		var resourceName = url.substring(idx+1)
		
		console.log('downloading... ' + resourceName)
		var stream = fs.createWriteStream(folder + '/' + resourceName)
		request
			.get(url)
			.on('error', function(err) {
				console.log(err)
			})
			.pipe(stream)
		// working? Not really! Some bug in the pipe? or createStream
	}
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

    downloadFile(src, 'audio')

    var columns = $audio.parent().parent().siblings();

    var english = $(columns[0]).text(); // This works!
    var $lithuanian = $($(columns[1]).children()[0]).children();

    var hint = $($lithuanian[0]).text();
    var lithuanian = $($lithuanian[1]).text();

    console.log(english, lithuanian, src)
  })
}

var processTopic = function(topic, relativeUrl) {
  var url = bookPathUrl + relativeUrl;
  console.log(url);
  request(url, getTopicPage)
}

var getIndex = function(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  var topicLinks = []
  var topics = []
  // var sel = 'div.Styl39 > a'
  // var sel = 'div.col-md-4 > a'
  var sel = 'div.col-md-4 > div > a'

  parsedHTML(sel).each(function(i, link) {
    var href = $(link).attr('href')
    var topic = $(link).text()
    console.log('adding... ' + topic + ' : ' + href)
    topicLinks.push(href)
    topics.push(topic)
  })

  // topicLinks.forEach(function(url) {
  //   processTopic(url)
  // })

  processTopic(topics[0], topicLinks[0]);
}

var bookIndexUrl = bookPathUrl + 'ENLT002.HTM';
request(bookIndexUrl, getIndex)


// fs.readFile('./ENLT002.HTM', function (err, data) {
//   if (err) throw err
//   console.log(data)

//   getIndex(null, null, data)
// });

// For testing topic page
// var html = fs.readFileSync('./ENLT003.HTM', 'utf8')
// getTopicPage(null, null, html)
