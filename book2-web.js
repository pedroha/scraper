var hogan = require("hogan.js");
var lithuanian = require('./lithuanian-uncompressed.json')
//console.log(JSON.stringify(lithuanian))

lithuanian = lithuanian.splice(0, 2)

// Convert Lithuanian to what we need with simple transforms

// lithuanian = lithuanian.map(function(topic) {
// });

var baseUrl = 'audio';

lithuanian.map(function(topic) {
	topic.words.map(function(entry) {
		entry.audio = baseUrl + '/' + entry.audio;
	});
});

console.log(JSON.stringify(lithuanian))

var sectionTemplate = `
<h3>{{topic}}</h3>
<ul>
{{#words}}
	{{>entry}}
{{/words}}
</ul>
`;

var entryTemplate = `
<li>
	<div>{{english}}</div>
	<div>{{lithuanian}}</div>
	<audio id="{{id}}">
		<source src="{{audio}}" type="audio/mpeg" />
	</audio>
</li>
`;

if (0) {
	var topic = hogan.compile(sectionTemplate);
	var rendered = topic.render(lithuanian[0], {entry: entryTemplate})
	console.log(rendered)
}


/////////////////////////////////////////////////
// var content = template.render( {
// 	english: 'Anglais',
// 	lithuanian: 'Hehehehe',
// 	audio: 'someWave.mp3'
// })

// console.log(content)
// var entry = lithuanian[0].words[0];
// content = template.render(entry);
// console.log(content)
/////////////////////////////////////////////////

if (0) {
	var template = hogan.compile(entryTemplate);
	var words = lithuanian[0].words.map(function(entry) {
	  return template.render(entry)
	})
	console.log(words.join())
}
