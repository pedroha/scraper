'use strict'

const fs = require('fs')
const audiosprite = require('audiosprite')

let lithuanian = require('../../res/lithuanian.json')
// lithuanian = lithuanian.splice(0, 2)
// console.log(JSON.stringify(lithuanian))

function convertToHowlerConfig(json) {
    let sprite = {};

    for (let k in json.spritemap) {
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

var concatAudios = function(output, files, callback) {
    let opts = {
        log: 'debug',
        output: output,
        format: 'howler',
        export: 'mp3',    // m4a is waaaay larger than mp3 produced
        vbr: 9,           // As low as quality as we can get
        samplerate: 22050 // Really low quality from 44100
    };
    audiosprite(files, opts, callback)
};

var outputConfig = function(howlerConfig) {
    // howlerConfig.sort(function(a, b) {
    //     return a.i - b.i
    // })
    // howlerConfig.forEach(function(item, i) {
    //     delete item.i // not needed after sorting
    // })

    var output = JSON.stringify(howlerConfig, null, 2, 80)
    output = output.replace(/"urls"/g, '"src"')
    fs.writeFileSync('howler-config.json', output)
    // console.log('-------------')
    // console.log(output)
    // console.log('-------------')
};

const base = './LT-phrases/'

var howlerConfig = {}

lithuanian.forEach(function(chapter, i) {
    let audioCollection = []
    chapter.words.forEach(function(entry, j) {
        let filename = base + entry.a
        audioCollection.push(filename)
    })

    let title = chapter.topic
    i = i + 1 // start from 1, to troubleshoot mismatches
    let suffix = ((i<10)? '00': (i<100)? '0': '') + i
    let output = 'phrases-' + suffix

    concatAudios(output, audioCollection, function(err, settings) {
        if (err) {
            return console.error(err)
        }

        howlerConfig[output] = {
            title,
            settings
        }

        var isLast = (Object.keys(howlerConfig).length == lithuanian.length)
        if (isLast) {
            console.log("At Last...")
            outputConfig(howlerConfig);
        }
    })
})
