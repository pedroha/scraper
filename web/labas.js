var audioBaseUrl = './audio/LT/';

var mediaPlayer = new MediaPlayer(audioBaseUrl);
var lessonPlayer = new LessonPlayer('.phrases ul > li', mediaPlayer);

mediaPlayer.playNext = function() {
    lessonPlayer.goToNext();
    lessonPlayer.play();
};

lessonPlayer.play();
