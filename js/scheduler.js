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

Scheduler.prototype.playSong = function (song, isLoop) {
    console.log ("Play Song");
    this.isPlaying = true;
};

Scheduler.prototype.playPattern = function (strip, controls, endCallback, bpm, channel) {
    console.log ("Play Pattern");
    this.isPlaying = true;
    var ordered = strip.getOrdered();
    var timeNow = this.context.currentTime + SCHED_DELAY;
    var quarterTime = 60 / bpm / 4;

    /* TODO */
    channel = 1;
    /* /TODO */

    var patternSchedule = [];

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
        console.log ("Note starting: " + whenOn + " ending: " + whenOff);
        this.midiHandler.sendMIDIMessage (msgOn, whenOn);
        this.midiHandler.sendMIDIMessage (msgOff, whenOff);
    }

    if (typeof endCallback === 'function') {
        setTimeout(endCallback, quarterTime * 1000);
    }

};

Scheduler.prototype.stop = function () {
    console.log ("Stop");
    this.isPlaying = false;
};