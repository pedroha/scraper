Install ffmpeg
brew install ffmpeg --with-theora --with-libogg --with-libvorbis

npm install -g audiosprite

CSS sprites
https://github.com/twolfson/gulp.spritesmith
http://frontendbabel.info/articles/css-sprites-with-gulp/
http://emlyn.net/posts/spritesmith-tutorial/
https://www.bignerdranch.com/blog/css-sprite-management-with-gulp/
https://www.npmjs.com/package/sprity

# Compress from: 945049 to 236478
ffmpeg -i result.mp3 -ab 36k result.36k.mp3

# webm: very highly compressed!! smallest file: 
ffmpeg -i 001-family.mp3 -ab 36k 001-family.36k.webm

npm ffmpeg? Sure we can!
https://docs.omniref.com/js/npm/fluent-ffmpeg/1.7.2
http://stackoverflow.com/questions/30842316/video-to-audio-file-convert-save-through-ffmpeg-in-node-js

webm, m4a, ogg

-rw-r--r--  1 pedroha  staff  236008 Aug  6 13:21 001-family.36k.ac3
-rw-r--r--  1 pedroha  staff  196830 Aug  6 13:21 001-family.36k.m4a
-rw-r--r--  1 pedroha  staff  236478 Aug  6 13:19 001-family.36k.mp3
-rw-r--r--  1 pedroha  staff  125858 Aug  6 13:20 001-family.36k.ogg
-rw-r--r--  1 pedroha  staff  134085 Aug  6 14:15 001-family.36k.webm
-rw-r--r--  1 pedroha  staff  944030 Aug  6 14:00 001-family.ac3
-rw-r--r--  1 pedroha  staff  323971 Aug  6 14:00 001-family.m4a
-rw-r--r--  1 pedroha  staff  945049 Aug  6 14:00 001-family.mp3
-rw-r--r--  1 pedroha  staff  355010 Aug  6 14:00 001-family.ogg
-rw-r--r--  1 pedroha  staff  236908 Aug  6 14:15 001-family.webm



https://trac.ffmpeg.org/wiki/Encode/MP3


https://www.howtoforge.com/tutorial/ffmpeg-audio-conversion/


{
   "src": [
    "001-family.ogg",
    "001-family.m4a",
    "001-family.mp3",
    "001-family.ac3"
  ],
  "sprite": {
    "0001": [
      0,
      1385
    ],
    "0002": [
      3000,
      1072
    ],
    "0003": [
      6000,
      680
    ],
    "0004": [
      8000,
      1281
    ],
    "0005": [
      11000,
      1176
    ],
    "0006": [
      14000,
      967
    ],
    "0007": [
      16000,
      1777
    ],
    "0008": [
      19000,
      1176
    ],
    "0009": [
      22000,
      1072
    ],
    "0010": [
      25000,
      1281
    ],
    "0011": [
      28000,
      1072
    ],
    "0012": [
      31000,
      967
    ],
    "0013": [
      33000,
      1176
    ],
    "0014": [
      36000,
      1881
    ],
    "0015": [
      39000,
      1281
    ],
    "0016": [
      42000,
      1176
    ],
    "0017": [
      45000,
      3083
    ],
    "0018": [
      50000,
      1777
    ],
    "0019": [
      53000,
      1777
    ],
    "0020": [
      56000,
      1672
    ]
  }
}