var baseUrl = './audio/LT/';
var howlers = {};

// Basis for a MediaBankPlayer

var autoplay = true; // setAutoplay(true/false) in MediaBankPlayer (multiple audio sprites, load/unload)
var currentSoundId;

var soundEnded = function() {
    if (currentSoundId) {
        var duration = getDuration(currentSoundId);

        var endingSound = currentSoundId; // avoid race conditions
        setTimeout(function() {
            if (autoplay && endingSound === currentSoundId) {
                playNext();
            }
        }, duration);
    }
};

var loadChapterSounds = function(chapter, onload) {
    if (!howlers[chapter]) {
        var settings = soundsConfig[chapter].settings;
        settings.src = baseUrl + settings.src;
        settings.preload = false;
        settings.onload = onload;
        settings.onend = soundEnded;

        settings.onloadederror = function(e) {
        	console.error(e);
        };

        howlers[chapter] = new Howl(settings);
        howlers[chapter].load();
    }
};

var getChapter = function(audioId) {
	for (var chapter in soundsConfig) {
		if (audioId in soundsConfig[chapter].settings.sprite) {
			return chapter;
		}
	}
};

var stopSound = function(callback) {
	currentSoundId = null;
	for (var chapter in soundsConfig) {
		if (howlers[chapter]) {
			howlers[chapter].stop()
			// howlers[chapter].fade(1, 0, 500); // not quite working as expected
		}
	}
	if (callback) {
		callback();
	}
};

var playSound = function(audioId) {
	var chapter = getChapter(audioId);

	var attemptPlay = function() {
		var play = function() {
			if (howlers[chapter]) {
				howlers[chapter].play(audioId)
				currentSoundId = audioId;
			}
		}
		if (currentSoundId) {
			stopSound(play)
		}
		else {
			play();
		}
	};
	if (!howlers[chapter]) {
		loadChapterSounds(chapter, attemptPlay);
	}
	else {
		attemptPlay();
	}
};

var getDuration = function(audioId) {
	var chapter = getChapter(audioId);
	var audioConfig = soundsConfig[chapter].settings.sprite[audioId];
	return audioConfig[1];
};

