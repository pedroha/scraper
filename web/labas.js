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

        $('html,body').animate({
          scrollTop: $getEntry(prevIdx).offset().top
        }, 1000);
    };

    function playEntry() {
        $(state.entries).removeClass('active');
        scrollToTop(state.currentItem);

        var $entry = $getEntry(state.currentItem);
        var audio = $entry.addClass('active').find('audio')[0];

        audio.addEventListener('ended', endPlay, false);
        audio.play();
    };

    var play = function() {
        playEntry();
    };

    var stop = function() {
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

    initialize();

    return {
        play: play,
        stop: stop,
        setEntries: setEntries
    };
};

var lessonPlayer = LessonPlayer('ul.entry-list > li');
lessonPlayer.play();

