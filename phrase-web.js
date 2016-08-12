'use strict';

const hogan = require("hogan.js");
const makeFolder = require('./utils/make-folder')
const writeFile = require('./utils/write-file')

let config = require('./res/config-lt.json')
let language = require(`./res/${config.language}.json`)
// language = language.splice(0, 5)
// console.log(JSON.stringify(language))

const PROJECT_NAME = 'labas'
const audioBaseUrl = 'audio'
const htmlFilename = `${config.language}.html`


var expandEntries = function() {
    language.map(function(topic) {
        topic.words.map(function expand(entry) {
            entry.audio = entry.a
            entry.language = entry.l
            entry.readable = entry.r
            entry.translation = entry.t
        })
    })    
}

var convertAudios = function(language, convertToFullUrl) {
    var transformAudioEntry = function(transform) {
        language.map(function(topic) {
            topic.words.map(transform)
        })
    }

    var fullAudioUrlTransform = function(entry) {
        entry.audio = audioBaseUrl + '/' + entry.audio
    }

    var audioIdTransform = function(entry) {
        var idx = entry.audio.indexOf('.')
        entry.audio = entry.audio.substr(0, idx)
    }

    var transform = convertToFullUrl? fullAudioUrlTransform : audioIdTransform
    transformAudioEntry(transform)
}

let templates = {}

templates['page'] = 
`
<!DOCTYPE html>
<html>
<head>
    <title>Labas!</title>
    <meta charset="utf-8" />
    <meta name="description" content="{{head.content}}">
    <link rel="stylesheet" type="text/css" href="app.css">
</head>
<body>
<!-- Based on resources from: Goethe-Verlag and www.50languages.com -->
    <h2>Phrases in {{language}}</h2>

    <ul class='phrases'>
    {{{ phrases }}}
    </ul>
    <script src="jquery.js"></script>
    <script src="howler.min.js"></script>
    <script>
        var language = '{{languageVar}}';
    </script>
    <script src="sounds-config.js"></script>
    <script src="media-player.js"></script>
    <script src="lesson-player.js"></script>
    <script src="app.js"></script>
</body>
</html>
`

templates['topic'] = 
`
    <li data-chapter="{{chapter}}">
        <h3>{{topic}}</h3>
        <ul>
        {{#words}}
            {{>entry}}
        {{/words}}
        </ul>
    </li>
`

templates['entry'] = 
`<li data-audio="{{audio}}">
    <dl>
        <dt>{{language}} {{readable}}</dt>
        <dd>{{translation}}</dd>
    </dl>
</li>
`
// <audio>
//     <source src="{{audio}}" type="audio/mpeg" />
// </audio>

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

let buildWebPage = function() {
    let topicTpl = hogan.compile(templates['topic'])
    let i = 1

    let topics = language.map(function(topic) {
        let suffix = ((i<10)? '00': (i<100)? '0': '') + i
        i++
        topic.chapter = 'phrases-' + suffix
        return topicTpl.render(topic, {entry: templates['entry']})
    })

    let pageTpl = hogan.compile(templates['page']);
    let rendered = pageTpl.render({
        head: {
            content: 'Goethe-Verlag and www.50languages.com'
        }, // meta stuff, like 'title' and so on
        phrases: topics.join(''),
        languageVar: config.language,
        language: config.language.capitalize()
    }).trim()
    //console.log(rendered)

    makeFolder('web', function() {
        writeFile(`web/${htmlFilename}`, rendered)
    })
}

expandEntries()
convertAudios(language)
buildWebPage()