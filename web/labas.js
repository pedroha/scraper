var LessonPlayer = function(audioNodeSelector) {
	'use strict';

	var state = {
		currentItem: 0,
		playing: true
	};

	var getEntries = function() {
		// This can change as we add DOM nodes dynamically!
		return $(audioNodeSelector).children();
	};

	var goToNext = function() {
		state.currentItem = (state.currentItem + 1) % getEntries().length; // Loop
	};

	var endPlay = function() {
		var pauseTime = 1000;

		setTimeout(function() {
			if (state.playing) {
				goToNext();
				playEntry();
			}
		}, pauseTime);
	};

	var scrollToTop = function(idx) {
		var i = (idx === 0) ? 0 : idx-1;

		$('html,body').animate({
          scrollTop: $(getEntries()[i]).offset().top
        }, 1000);
	};

	function playEntry() {
		state.playing = true;

		$(getEntries()).removeClass('active');
		scrollToTop(state.currentItem);

		var $audio = $(getEntries()[state.currentItem]);
		var audio = $audio.addClass('active').find('audio')[0];

		audio.addEventListener('ended', endPlay, false);
		audio.play();
	};

	this.stop = function() {
		state.playing = false;
	};

	this.play = function() {
		playEntry();
	}
};

var lessonPlayer = new LessonPlayer('ul.entry-list');
lessonPlayer.play();

