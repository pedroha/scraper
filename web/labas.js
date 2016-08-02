var LessonPlayer = function(audioDomContainerSelector) {
	'use strict';

	var state = {
		entries: [],
		currentItem: 0,
		playing: false
	};

	var $getEntry = function(i) {
		return $(state.entries[i]);
	};

	var goToNext = function() {
		// Loop
		state.currentItem = (state.currentItem + 1) % state.entries.length; 
	};

	var endPlay = function(e) {
		var pauseTime = e.target.duration * 1000 + 500;

		setTimeout(function() {
			if (state.playing) {
				goToNext();
				playEntry();
			}
		}, pauseTime);
	};

	var scrollToTop = function(idx) {
		var prevIdx = (idx === 0) ? 0 : idx-1; // scrollTop() to previous entry

		$('html,body').animate({
          scrollTop: $getEntry(prevIdx).offset().top
        }, 1000);
	};

	function playEntry() {
		$(state.entries).removeClass('active');
		scrollToTop(state.currentItem);

		var $audio = $getEntry(state.currentItem);
		var audio = $audio.addClass('active').find('audio')[0];

		audio.addEventListener('ended', endPlay, false);
		audio.play();
	};

	this.stop = function() {
		state.playing = false;
	};

	this.play = function() {
		playEntry();
	};

	var self = this;

	this.setEntries = function(entries) {
		var $li = $(audioDomContainerSelector);
		state.entries = $li;

		// TODO: FIX BUG on offset
		// 2nd topic list -> goes to first topic list always!
		// Easier to add a custom data attribute: entry-#id

		// $li.on('click', function() {
		// 	state.currentItem = $(this).index();
		// 	self.play();
		// });
	};

	var setup = function() {
		state.playing = true;

		if (audioDomContainerSelector) {
			self.setEntries(audioDomContainerSelector);
		}
		else {
			throw new Error('LessonPlayer(audioDomContainerSelector): missing selector');
		}
	};

	setup();
};

var lessonPlayer = new LessonPlayer('ul.entry-list > li');
lessonPlayer.play();

