// FAVORITE!!! http://maxogden.com/scraping-with-node.html

// Probably a good one!
// https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping

var fs = require('fs')
var request = require('request')
var $ = require('cheerio')

var downloadFile = function(url, path) {
    console.log('downloading... ' + url)

    var stream = fs.createWriteStream(path)
    request
      .get(url)
      .on('error', function(err) {
        console.log(err)
      })
      .pipe(stream)
};

var downloadAudioResource = function(url, folder) {
	var idx = url.lastIndexOf('/')
	if (idx > 0) {
		var name = url.substring(idx+1)
    var isAudioFile = (name && name.substring(name.length-4) === '.mp3');

    if (isAudioFile) {
      var path = folder + '/' + name; 
      fs.access(path, fs.R_OK, (err) => {
        if (err) { // We don't have it yet, so let's get it!
          downloadFile(url, path)
        }
        else {
          var stats = fs.statSync(path)
          if (stats["size"] === 0) {
            console.log('File size is 0: ' + name)
            downloadFile(url, path)
          }
          else {
            console.log('We already have this audio file: ' + name)
          }
        }
      })
    }
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

    downloadAudioResource(src, 'audio')

    var columns = $audio.parent().parent().siblings();

    var english = $(columns[0]).text(); // This works!
    var $lithuanian = $($(columns[1]).children()[0]).children();

    var hint = $($lithuanian[0]).text();
    var lithuanian = $($lithuanian[1]).text();

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

  topicLinks.forEach(function(url) {
    processTopic(url)
  })
//  processTopic(topicLinks[0]);
}

var createFolder = function(path) {
  fs.mkdir(path, function(err) {
    if (err) {
      console.error(err);
    }
    console.log("Directory created successfully!");
  })
}

var ensureFolderExists = function(path) {
  // Create /audio if it doesn't exist already
  fs.readdir(path, function(err, files) {
    if (err) {
      createFolder(path)
    }
    files.forEach(function(file){
      console.log( file );
    });
  })  
}

ensureFolderExists('audio');

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
