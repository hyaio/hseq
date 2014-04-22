var self, SCHED_DELAY = 0.4;

var Scheduler = function (playButton, midiHandler, context) {
    this.isPlaying = false;
    this.playButton = playButton;
    this.midiHandler = midiHandler;
    this.context = context;
    self = this;
};

Scheduler.prototype.getPlayingState = function () {
    /*return this.isPlaying;*/
    return false;
};

Scheduler.prototype.clearTimeouts = function (index) {
    for (var i = 0; i < this.timeoutArray.length; i += 1) {
        clearTimeout(this.timeoutArray[i]);
    }
    this.timeoutArray = [];
};

Scheduler.prototype.schedulerPatternHelper = function (pattern, cb, bpm, ch, nPattern) {
    var beatTime = (60 / bpm) * 8;

    var schedule_when = ((beatTime * nPattern) / 2) * 1000;
    var beat_start = beatTime * nPattern + SCHED_DELAY + this.context.currentTime;

    this.timeoutArray = [];

    this.timeoutArray[nPattern] = setTimeout(function () {
        self.playPattern(pattern.strip, pattern.controls.controlData, cb, bpm, ch, beat_start);
    }, schedule_when);
};

Scheduler.prototype.playSong = function (song, isLoop, endCallback, bpm, patternList, patternView) {
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
                    //console.log("Playing #" + y + " of pattern " + x);
                    this.schedulerPatternHelper (patternView.getPattern(x), countPlayed, bpm, patternList[x].channel, y);
                }
            }
        }
    }

    if (typeof endCallback === 'function') {
        // TODO IF NOT LOOP
        var beatTime = (60 / bpm) * 8;
        setTimeout(endCallback, beatTime * song.songLen * 1000);
    }
};

Scheduler.prototype.playPattern = function (strip, controls, endCallback, bpm, channel, startTime) {
    console.log ("Play Pattern");
    this.isPlaying = true;
    var ordered = strip.getOrdered();

    var timeNow = startTime;

    if (!startTime) {
        timeNow = this.context.currentTime + SCHED_DELAY;
    }

    var quarterTime = 60 / bpm;

    for (var note in ordered) {
        var n = ordered[note];
        var msgOn = {
            type: "noteon",
            channel: channel,
            pitch: n.number + 24,
            velocity: 127
        };
        var msgOff = {
            type: "noteoff",
            channel: channel,
            pitch: n.number + 24,
            velocity: 127
        };
        var whenOn = timeNow + (n.start * quarterTime);
        var whenOff = whenOn + (n.duration * quarterTime);
        //console.log ("Note starts at:", whenOn, "stops at:", whenOff);
        this.midiHandler.sendMIDIMessage (msgOn, whenOn);
        this.midiHandler.sendMIDIMessage (msgOff, whenOff);
    }


    for (var i = 0; i < 32; i+=1) {

        var msgArray = [];

        for (var controller in controls) {
            if (controller.indexOf('cc') === 0) {
                var cc = parseInt(controller.substr(2, 4), 10);
                var value = controls[controller][i];
                if (typeof value !== "undefined") {
                    msgArray.push( {
                        type: "controlchange",
                        channel: channel,
                        control: cc,
                        value: value
                    });
                }
            }
        }
        var timeCC =  (quarterTime / 4) * i + timeNow;
        if (msgArray.length) {
            this.midiHandler.sendMIDIMessage(msgArray, timeCC);
            //console.log("sending", msgArray, "number", i,  "at", timeCC);
        }
    }

    if (typeof endCallback === 'function') {
        setTimeout(endCallback, quarterTime * 8 * 1000);
    }

};

Scheduler.prototype.stop = function () {
    this.isPlaying = false;
};