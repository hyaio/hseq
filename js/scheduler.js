var Scheduler = function (playButton, midiHandler) {
    this.isPlaying = false;
    this.playButton = playButton;
    this.midiHandler = midiHandler;
};

Scheduler.prototype.getPlayingState = function () {
    return this.isPlaying;
};

Scheduler.prototype.playSong = function (song, isLoop) {
    console.log ("Play Song");
    this.isPlaying = true;
};

Scheduler.prototype.playPattern = function (strip, controls, endCallback) {
    console.log ("Play Pattern");
    this.isPlaying = true;
    var notes = strip.getHash();
    var ordered = strip.getOrdered();
    console.log (notes, ordered);
};

Scheduler.prototype.stop = function () {
    console.log ("Stop");
    this.isPlaying = false;
};