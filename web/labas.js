var LessonPlayer = function(audioDomContainerSelector) {
    'use strict';

    var clickable = 1;

    var state = {
        entries: [],
        currentItem: 0,
        playing: false
    };

    var goToNext = function() { // Loop
        state.currentItem = (state.currentItem + 1) % state.entries.length; 
    };

    var endPlay = function(e) {
        var audio = e.target;
        var speakerRepeatingTime = audio.duration * 1000 + 500;
        var current = state.currentItem;

        audio.removeEventListener('ended', endPlay); // let's clean up!

        setTimeout(function() {
            // avoid race conditions: autoplay + clicking
            if (state.playing && current === state.currentItem) {
                goToNext();
                playEntry();
            }
        }, speakerRepeatingTime);
    };

    var $getEntry = function(i) {
        return $(state.entries[i]);
    };

    var scrollToTop = function(idx) {
        // scrollTop() to previous entry
        var prevIdx = (idx === 0) ? 0 : idx-1;
        var $previous = $getEntry(prevIdx);

        if ($previous.is(':visible')) {
            $('html,body').animate({
              scrollTop: $previous.offset().top
            }, 1000);            
        }
    };

    var getCurrentAudio = function() {
        var $entry = $getEntry(state.currentItem);
        return $entry.find('audio')[0];
    };

    var makeEntryListVisible = function($entry) {
        var $entryList = $entry.parent('.entry-list');
        if (!$entryList.is(':visible')) {
            $entryList.slideDown();
        }
    };

    function playEntry() {
        $(state.entries).removeClass('active');
        scrollToTop(state.currentItem);

        var $entry = $getEntry(state.currentItem);
        makeEntryListVisible($entry);
        $entry.addClass('active');

        var audio = getCurrentAudio();
        audio.addEventListener('ended', endPlay, false);
        audio.play();
    };

    var play = function() {
        playEntry();
    };

    var stop = function() {
        var audio = getCurrentAudio();
        audio.removeEventListener('ended', endPlay); // let's clean up!

        state.playing = false;
    };

    var setClickable = function($entry) {
        $entry.each(function(i, item) {
            $(this).on('click', function() {
                state.currentItem = i;
                play();
            });
        });
    };

    var setEntries = function(entriesBySelector) {
        state.entries = $(entriesBySelector);
        if (clickable) {
            setClickable(state.entries);
        }
    };

    var initialize = function() {
        state.playing = true;

        if (audioDomContainerSelector) {
            setEntries(audioDomContainerSelector);
        }
        else {
            throw new Error('LessonPlayer(audioDomContainerSelector): missing selector');
        }
    };

    var setAutoplay = function(val) {
        state.playing = val;
    };

    initialize();

    return {
        play: play,
        stop: stop,
        setAutoplay: setAutoplay,
        setEntries: setEntries
    };
};

var lessonPlayer = LessonPlayer('ul.entry-list > li');
// lessonPlayer.play();

$('.phrases h3').on('click', function() {
    var $entryList = $(this).next('.entry-list');

    if ($entryList.is(':visible')) {
        $entryList.slideUp();
    } else {
        $entryList.slideDown();
    }
});
