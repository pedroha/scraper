var fs = require('fs')

var writeFileSync = function(path, content, continuationFn) {
	fs.writeFileSync(path, content);
	if (typeof continuationFn === 'function') {
		continuationFn()
	}
}

module.exports = writeFileSync