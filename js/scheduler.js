var SCHED_DELAY = 0.4;

var Scheduler = function (playButton, midiHandler, context) {
    this.isPlaying = false;
    this.playButton = playButton;
    this.midiHandler = midiHandler;
    this.context = context;
};

Scheduler.prototype.getPlayingState = function () {
    return this.isPlaying;
};

Scheduler.prototype.playSong = function (song, isLoop, endCallback, bpm) {
    console.log ("Play Song");
    this.isPlaying = true;
    // For every column
    for (var y = 0; y < song.songLen; y+=1) {
        // Take every row
        if (song.data[y]) {
            for (var x = 0; x < song.data[y].length; x += 1) {
                // Play the row
                var row = song.data[y][x];
                if (row) {
                    console.log("Playing #" + y + " of pattern " + x);
                }
            }
        }
    }
};

Scheduler.prototype.playPattern = function (strip, controls, endCallback, bpm, channel) {
    console.log ("Play Pattern");
    this.isPlaying = true;
    var ordered = strip.getOrdered();
    var timeNow = this.context.currentTime + SCHED_DELAY;
    var quarterTime = 60 / bpm / 4;

    for (var note in ordered) {
        var n = ordered[note];
        var msgOn = {
            type: "noteon",
            channel: channel,
            pitch: n.number,
            velocity: 127
        };
        var msgOff = {
            type: "noteoff",
            channel: channel,
            pitch: n.number,
            velocity: 127
        };
        var whenOn = timeNow + (n.start * quarterTime);
        var whenOff = whenOn + (n.duration * quarterTime);
        this.midiHandler.sendMIDIMessage (msgOn, whenOn);
        this.midiHandler.sendMIDIMessage (msgOff, whenOff);
    }

    if (typeof endCallback === 'function') {
        setTimeout(endCallback, quarterTime * 1000);
    }

};

Scheduler.prototype.stop = function () {
    this.isPlaying = false;
};