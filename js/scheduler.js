var self, SCHED_DELAY = 0.4;

var Scheduler = function (playButton, midiHandler, context) {
    this.midiHandler = midiHandler;
    this.context = context;
    self = this;
};

Scheduler.prototype.clearTimeouts = function () {
    // Waiting state
    this.stopped = true;
    clearTimeout(this.endTimeout);
};

Scheduler.prototype.setLoop = function (loop) {
    this.loop = loop;
};

Scheduler.prototype.playSong = function (song, isLoop, endCallback, bpm, patternList, patternView) {
    console.log ("Play Song");

    var beatTime = (60 / bpm) * 8;

    var y = 0;

    var schedule = function () {
        console.log ("Scheduling for", y);
        if (this.stopped) {
            this.stopped = false;
            console.log ("Stopped state");
            if (typeof endCallback === 'function') {
                endCallback();
            }
            return;
        }

        if (y === song.songLen) {
            if (!this.loop) {
                console.log("Finished by itself");
                endCallback();
                return;
            }
            else {
                y = 0;
            }
        }
        var beat_start = SCHED_DELAY + this.context.currentTime;
        if (song.data[y]) {
            for (var x = 0; x < song.data[y].length; x += 1) {
                if (song.data[y][x]) {
                    self.playPattern(
                        patternView.getPattern(x).strip,
                        patternView.getPattern(x).controls.controlData,
                        null, bpm, patternList[x].channel, beat_start);
                }
            }
        }

        y += 1;

        console.log ("reScheduling in", beatTime);
        setTimeout(schedule, beatTime * 1000);

    }.bind(this);

    schedule();

    if (typeof endCallback === 'function') {
        if (!this.loop) {
            var beatTime = (60 / bpm) * 8;
            this.endTimeout = setTimeout(endCallback, beatTime * song.songLen * 1000);
        }
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
    var vel = 95;

    for (var note in ordered) {
        var n = ordered[note];

        /* Calculate velocity */
        var velIndex = Math.floor(n.start / SEMICROMA);

        if (controls.velocity && (typeof controls.velocity[velIndex] !=="undefined")) {
            vel = controls.velocity[velIndex];
        }

        var msgOn = {
            type: "noteon",
            channel: channel,
            pitch: n.number + 24,
            velocity: vel
        };
        var msgOff = {
            type: "noteoff",
            channel: channel,
            pitch: n.number + 24,
            velocity: vel
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
    this.clearTimeouts();
};