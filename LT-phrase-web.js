let lithuanian = require('./res/lithuanian-uncompressed.json')
const hogan = require("hogan.js");
const makeFolder = require('./utils/make-folder')
const writeFile = require('./utils/write-file')

//console.log(JSON.stringify(lithuanian))

const PROJECT_NAME = 'labas';
const audioBaseUrl = 'audio';

// Convert Lithuanian to what we need with simple transforms
lithuanian.map(function(topic) {
	topic.words.map(function(entry) {
		entry.audio = audioBaseUrl + '/' + entry.audio;
	});
});

lithuanian = lithuanian.splice(0, 5)

// console.log(JSON.stringify(lithuanian))
let templates = {};
// <link href='https://fonts.googleapis.com/css?family=Goudy+Bookletter+1911' rel='stylesheet' type='text/css'>

templates['page'] = 
`
<!DOCTYPE html>
<html>
<head>
	<title>Labas!</title>
	<meta charset="utf-8" />
	<meta name="description" content="Goethe-Verlag and www.50languages.com">
	<link rel="stylesheet" type="text/css" href="${PROJECT_NAME}.css">
</head>
<body>
<!-- This work is attributed to: Goethe-Verlag and www.50languages.com -->
{{{body}}}
	<script src="jquery.js"></script>
	<script src="${PROJECT_NAME}.js"></script>
</body>
</html>
`;

templates['topic'] = 
`
	<h3>{{topic}}</h3>
	<ul class="entry-list">
	{{#words}}
		{{>entry}}
	{{/words}}
	</ul>
`;

templates['entry'] = 
`<li>
	<div>{{english}}</div>
	<div>{{lithuanian}}</div>
	<audio>
		<source src="{{audio}}" type="audio/mpeg" />
	</audio>
</li>
`;

let buildWebPage = function() {
	let topicTpl = hogan.compile(templates['topic'])
	let topics = lithuanian.map(function(topic) {
		return topicTpl.render(topic, {entry: templates['entry']})
	})
	let pageTpl = hogan.compile(templates['page']);
	let rendered = pageTpl.render({
		head: {}, // meta stuff, like 'title' and so on
		body: topics.join('')
	}).trim()
	//console.log(rendered)

	makeFolder('web', function() {
		writeFile(`web/${PROJECT_NAME}.html`, rendered)
	})
}

buildWebPage()