// require hogan
var hogan = require("hogan.js");

// construct template string
// var template = "Hello {{world}}!";

// compile template
// var hello = hogan.compile(template);


// compile template
var template = hogan.compile("@{{name}}");

var team = ['dhg', 'fat', 'jimio', 'nickgreen', 'sayrer'];

team.map(function (twitterer) {
 
  // Render context to template
  return template.render({name: twitterer });

});

// outputs "Follow: @dhg @fat @jimio @nickgreen @sayrer!"
console.log('Follow: ' + team.join(' ') + '!');

var context = {
    message: 'Crazy hot weather in NYC!',
    tweets: [ { tweet: 'uno'}, { tweet: 'dos' }, { tweet: 'tres'} ]
};

var partial = `
<div class="timeline">
  <!-- load more button -->
  <button>{{message}}</button>

  <!-- tweet object -->
  {{#tweets}}
    {{tweet}}
  {{/tweets}}
</div>
`;

console.log(partial);
template = hogan.compile(partial);

var content = template.render(context);
console.log(content);


