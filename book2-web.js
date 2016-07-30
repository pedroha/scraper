var hogan = require("hogan.js");
var lithuanian = require('./lithuanian-uncompressed.json')
//console.log(JSON.stringify(lithuanian))

var audioBaseUrl = 'audio';

// Convert Lithuanian to what we need with simple transforms
var cnt = 0;
lithuanian.map(function(topic) {
	topic.words.map(function(entry) {
		entry.id = 'audio-' + cnt;
		entry.audio = audioBaseUrl + '/' + entry.audio;
		cnt++;
	});
});

// lithuanian = lithuanian.splice(0, 3)
// console.log(JSON.stringify(lithuanian))

var pageTemplate = `
<!DOCTYPE html>
<html>
<head>
	<title>Labas!</title>
</head>
<body>
{{{body}}}
</body>
</html>
`;

var sectionTemplate = 
`
	<h3>{{topic}}</h3>
	<ul>
	{{#words}}
		{{>entry}}
	{{/words}}
	</ul>
	<hr/>
`;

var entryTemplate = 
`<li>
	<div>{{english}}</div>
	<div>{{lithuanian}}</div>
	<audio id="{{id}}">
		<source src="{{audio}}" type="audio/mpeg" />
	</audio>
</li>
`;

var topicTpl = hogan.compile(sectionTemplate);
var topics = lithuanian.map(function(topic) {
	return topicTpl.render(topic, {entry: entryTemplate})
})

var pageTpl = hogan.compile(pageTemplate);
var rendered = pageTpl.render({body: topics.join('')})
console.log(rendered)

