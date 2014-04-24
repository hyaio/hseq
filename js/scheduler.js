var self, SCHED_DELAY = 0.4;

var Scheduler = function (playButton, midiHandler, context) {
    this.midiHandler = midiHandler;
    this.context = context;
    self = this;
};

Scheduler.prototype.clearTimeouts = function () {
    //clearTimeout(this.scheduleTimeout);
    this.stopped = true;
    clearTimeout(this.endTimeout);
};

Scheduler.prototype.playSong = function (song, isLoop, endCallback, bpm, patternList, patternView) {
    console.log ("Play Song");

    var beatTime = (60 / bpm) * 8;

    var y = 0;
    var wait = false;

    var schedule = function () {
        console.log ("Scheduling for", y);
        if (this.stopped) {
            this.stopped = false;
            wait = true;
            console.log ("Wait state");
            return;
        }

        // TODO IF NOT LOOP
        if (y === song.songLen) {
            console.log ("Finished by itself");
            endCallback ();
            return;
        }
        var beat_start = SCHED_DELAY + this.context.currentTime;
        for (var x = 0; x < song.data[y].length; x += 1) {
            self.playPattern(patternView.getPattern(x).strip, patternView.getPattern(x).controls.controlData, null, bpm, patternList[x].channel, beat_start);
        }

        y += 1;

        console.log ("reScheduling in", beatTime);
        this.scheduleTimeout = setTimeout(schedule, beatTime * 1000);

    }.bind(this);

    schedule();

    if (typeof endCallback === 'function') {
        // TODO IF NOT LOOP
        var beatTime = (60 / bpm) * 8;
        this.endTimeout = setTimeout(endCallback, beatTime * song.songLen * 1000);
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

Scheduler.prototype.stop = function (cb) {
    this.clearTimeouts();
    cb();
};