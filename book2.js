// FAVORITE!!! http://maxogden.com/scraping-with-node.html

// Probably a good one!
// https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping

var fs = require('fs')
var request = require('request')
var $ = require('cheerio')
var beautify = require("json-beautify");

var outputHint = false;
var compressed = true;

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

var getFileName = function(url) {
  var name = null;
  var idx = url.lastIndexOf('/')
  if (idx > 0) {
    name = url.substring(idx+1)
  }
  return name  
}

var downloadAudioResource = function(url, folder) {
  var name = getFileName(url)
  if (name) {
    var isAudioFile = (name && name.substring(name.length-4) === '.mp3');

    if (isAudioFile) {
      var path = folder + '/' + name; 
      fs.access(path, fs.R_OK, (err) => {
        if (err) { // We don't have it yet, so let's get it!
          downloadFile(url, path)
        }
        else {
          // Sometimes, we get: { [Error: socket hang up] code: 'ECONNRESET' }
          var stats = fs.statSync(path)
          if (stats["size"] === 0) { // Retry download
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

const bookPathUrl = 'http://www.goethe-verlag.com/book2/EN/ENLT/';
const databaseFilename = 'lithuanian.json';

var database = []

var outputDatabase = function() {
  var sorted = database.sort(function(right, left) {
    var a = parseInt(right.topic)
    var b = parseInt(left.topic)
    return a - b
  });

  // var json = JSON.stringify(sorted);
  var json = beautify(sorted, null, 2, 120)
  console.log(json)
  fs.writeFileSync(databaseFilename, json);
}

var parseTopicPage = function(html, topic) {
  console.log('getTopicPage: ' + topic)

  let parsedHTML = $.load(html)
  let words = []

  let sel = 'audio > source'
  parsedHTML(sel).each(function(i, audio) {
    let $audio = $(audio)
    let src = $audio.attr('src')
    console.log('adding... ' + src)
    // downloadAudioResource(src, 'audio')

    let columns = $audio.parent().parent().siblings();
    let english = $(columns[0]).text().trim();
    let lithuanianNodes = $($(columns[1]).children()[0]).children();
    let lithuanian = '';
    let hint = '';

    if (lithuanianNodes && lithuanianNodes.length > 1) {
      hint = $(lithuanianNodes[0]).text().trim();
      lithuanian = $(lithuanianNodes[1]).text().trim();
    } else {
      lithuanian = $(columns[0]).text().trim();

      // Hack for the English translation, on the other side of the table!
      let $tableRow = $(columns[0]).closest('tr')
      let index = $tableRow.index()
      let $firstInRow = $($tableRow.closest('div.row').children()[0])
      let spans = $firstInRow.find('span')
      english = $(spans[index]).text().trim()
    }

    let entry

    if (compressed) {
      entry = {
        e: english,
        l: lithuanian,
        a: getFileName(src)
      }
    }
    else {
      entry = {
        english,
        lithuanian,
        audio: getFileName(src)
      }
    }

    if (outputHint) {
      entry.hint = hint;
    }
    console.log(english, lithuanian, src)

    words.push(entry)
  })
  database.push({
    topic,
    words
  })
}

var getTopicPage = function(topic) {
  return function(err, resp, html) {
    if (err) return console.error(err)

    parseTopicPage(html, topic)
  };
}

var findTopic = function(topic) {
  for (let i = 0; i < database.length; i++) {
    var entry = database[i];
    if (entry.topic === topic) {
      return true;
    }
  }
  return false;
}

var processTopic = function(relativeUrl, topic) {
  var url = bookPathUrl + relativeUrl;
  console.log(url);

  if (!findTopic(topic)) {
    request(url, getTopicPage(topic))
  }
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
    var topic = $(link).text().trim()
    console.log('adding... ' + topic + ' : ' + href)
    topicLinks.push(href)
    topics.push(topic)
  })

  // var cnt = 0;
  // topicLinks.forEach(function(url) {
  //   var isLast = (cnt === topics.length-1)
  //   processTopic(url, topics[cnt], isLast)
  //   cnt++;
  // })

  // processTopic(topicLinks[0], topics[0], true)

  for (let i = 0; i < topicLinks.length; i++) {
    processTopic(topicLinks[i], topics[i])
  }
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

var main = true;

if (typeof main !== 'undefined') {
  ensureFolderExists('audio');

  var bookIndexUrl = bookPathUrl + 'ENLT002.HTM';
  request(bookIndexUrl, getIndex)

  setTimeout(outputDatabase, 5000) // Give it enough time (another timing hack)  
}


// fs.readFile('./ENLT002.HTM', function (err, data) {
//   if (err) throw err
//   console.log(data)
//   getIndex(null, null, data)
// });

// For testing topic page

// var html = fs.readFileSync('./ENLT003.HTM', 'utf8')
// parseTopicPage(html, '1 Family')
