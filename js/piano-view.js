var PianoView = function (el, minOct, octaves) {
    this.el = el;
    this.tw = el.width;
    this.th = el.height;
    this.ctx = el.getContext("2d");
    this.minOct = minOct;
    this.octaves = octaves;

    var keyboardNotes = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];

    var nNotes = octaves * 12;

    for (var i = 0; i < nNotes; i += 1) {

        var noteName = keyboardNotes[i % 12];
        var oct = minOct + (octaves - Math.floor(i / 12)) - 1;

        var accident = (noteName.charAt(1) === "#");

        // Draw the key
        if (accident) {
            this.ctx.fillStyle = "black";
        }
        else {
            this.ctx.fillStyle = "white";
        }

        var width = this.tw;
        var height = this.th / nNotes;
        var top = i * height;
        var left = 0;
        this.ctx.fillRect(left, top, width, height - 1);

        // Draw text
        if (accident) {
            this.ctx.fillStyle = "white";
        }
        else {
            this.ctx.fillStyle = "black";
        }

        var noteString = noteName + " " + oct;
        this.ctx.font = "12px 'Exo 2'";
        this.ctx.fillText(noteString, 20, top + 18);
    }

};