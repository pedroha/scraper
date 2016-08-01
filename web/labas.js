var currentItem = 0

var entries = $('ul.entry-list').children();
var $entries = $(entries);

// Pick one item at a time and activate for few seconds

for (let i = 0; i < entries.length; i++) {
	setTimeout(function() {
		$entries.removeClass('active');
		var $currentEntry = $(entries[i])
		if (i > 0) {
			var $previousEntry = $(entries[i-1])
			$('html,body').animate({
	          scrollTop: $previousEntry.offset().top
	        }, 1000);
		}
		$currentEntry.addClass('active').find('audio')[0].play();
	}, 3000 * i)
}


