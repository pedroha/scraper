var audiosprite = require('audiosprite')

var root = './../../'

var files = [];
for (let i = 0; i < 20; i++) {
	let idx = (((i+1) < 10) ? '0':'') + (i+1)
	let name = root + '/web/audio/00' + idx + '.mp3'
	files.push(name)
}
console.log(files)

var opts = {output: '001-family'}

function convertToHowlerConfig(json) {
	var sprite = {};

	for (var k in json.spritemap) {
		let entry = json.spritemap[k]
		let start = entry.start * 1000
		let end = Math.floor(entry.end * 1000) + 1
		let duration = end - start
		sprite[k] = [start, duration]
	}

	return {
		src: json.resources,
		sprite: sprite
	}
}

audiosprite(files, opts, function(err, obj) {
  if (err) return console.error(err)

  console.log('-------------')
  console.log(JSON.stringify(obj, null, 2, 80))
  console.log('-------------')

  obj = convertToHowlerConfig(obj)
  console.log(JSON.stringify(obj, null, 2, 80))
})
