var SEMIBREVE = 4, // (bar)
    MINIMA = 2, // (half bar)
    SEMIMINIMA = 1, // (quarter bar)
    CROMA = 0.5, // (1/8 bar)
    SEMICROMA = 0.25; // (1/16 bar)

var RollView = function (el, strip) {
    this.name = "";
    this.el = el;
    this.tw = el.width;
    this.th = el.height;
    this.ctx = el.getContext("2d");
    this.down = false;
    this.step = CROMA;
    this.defaultDuration = SEMIMINIMA;
    this.delta = null;
    this.resizing = false;
    this.moving = false;
    this._renderBound = this._render.bind(this);

    this.strip = strip;
    this.noteHeight = Math.round(this.th / (5 * 12));
    this.noteWidth = this.tw / 8;
    this.boundDownHandler = this.downHandler.bind(this);
    this.boundMoveHandler = this.moveHandler.bind(this);
    this.boundUpHandler = this.upHandler.bind(this);
    this.boundDblHandler = this.dblHandler.bind(this);

    el.addEventListener("mousedown", this.boundDownHandler);
    el.addEventListener("mousemove", this.boundMoveHandler);
    el.addEventListener("mouseup", this.boundUpHandler);
    el.addEventListener("dblclick", this.boundDblHandler);

    if (this.strip) {
        this.render();
    }

};

RollView.prototype.setStrip = function (strip) {
    this.strip = strip;
    this.render();
};

RollView.prototype.setStep = function (step) {
    this.step = step;
};

RollView.prototype.setDefaultDuration = function (duration) {
    this.defaultDuration = duration;
};

RollView.prototype._renderGrid = function () {

    var gridGap = this.noteWidth * this.step;

    this.ctx.beginPath();

    if (this.step) {
        // Draw the grid
        for (var x = 0; x <= this.tw; x += gridGap) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.th);
        }
    }

    // Draw the horizontal lines
    for (var y = 0; y <= this.th; y += this.noteHeight) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.tw, y);
    }

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.stroke();

};

RollView.prototype._render = function () {

    var selectedNote = null;
    var notes = this.strip.getHash();
    this.ctx.fillStyle = 'rgb(30,30,30)';
    this.ctx.fillRect(0, 0, this.tw, this.th);

    this._renderGrid();

    for (var n in notes) {

        var note = notes[n];
        var left = note.start * this.noteWidth;
        var width = note.duration * this.noteWidth - 1;
        var top = this.th - (note.number * this.noteHeight);
        var height = this.noteHeight - 1;

        if (this.selected && note.id === this.selected) {
            // store it for later
            selectedNote = {
                left: left,
                top: top,
                width: width,
                height: height
            };
        }
        else {
            this.ctx.fillStyle = '#FFC500';
            this.ctx.fillRect(left, top, width, height);
        }
    }
    // At the end, paint the selected note
    if (selectedNote) {
        this.ctx.fillStyle = 'OrangeRed';
        this.ctx.fillRect(selectedNote.left, selectedNote.top, selectedNote.width, selectedNote.height);
    }

};

RollView.prototype.render = function () {
    window.requestAnimationFrame(this._renderBound);
};

RollView.prototype.getPosFromEvent = function (e) {
    var pos = getEventPosition(e, this.el);
    var start = e.offsetX / this.noteWidth;
    var number = Math.ceil((this.th - e.offsetY) / this.noteHeight);
    return {
        start: start,
        number: number
    };
};

RollView.prototype.getNoteFromEvent = function (e) {

    var pos = this.getPosFromEvent(e);

    return this.strip.getNoteAtPosition(pos.start, pos.number);
};

RollView.prototype.downHandler = function (e) {

    var dirty = false;

    var selNote = this.getNoteFromEvent(e);

    if (selNote) {
        this.selected = selNote.id;
        this.down = true;
        dirty = true;
    }
    else {
        if (this.selected) {
            this.selected = undefined;
            dirty = true;
        }
    }

    if (dirty) {
        this.render();
    }
};

RollView.prototype.moveHandler = function (e) {
    var dirty = false;

    var selNote = this.getNoteFromEvent(e);

    // If this is a dragging event and some note is selected
    if (this.down && this.selected) {
        console.log("bring the action!");

        var pos = this.getPosFromEvent(e);

        var oldNote = this.strip.getNote(this.selected);
        var delta = pos.start - oldNote.start;

        // If we're already resizing, or we're dragging for the first time on the last 20% of the note, do the resize
        if (!this.moving && (this.resizing || delta > oldNote.duration * 0.8)) {
            this.resizing = true;

            var newDuration = delta;
            if (this.step) {
                newDuration = Math.round(newDuration / this.step) * this.step;
            }

            if (newDuration < this.step) {
                newDuration = oldNote.duration;
                dirty = false;
            }
            if (newDuration < (SEMICROMA / 2)) {
                newDuration = SEMICROMA / 2;
            }
            this.strip.resizeNote(this.selected, newDuration);
            dirty = true;

        }
        // else do the move
        else {
            this.moving = true;
            var newNote = {
                start: oldNote.start,
                number: oldNote.number
            };

            if (this.delta === null) {
                this.delta = delta;
            }

            // Change horizontal position
            newNote.start = pos.start - this.delta;

            if (this.step) {
                newNote.start = Math.round(newNote.start / this.step) * this.step;
                if (newNote.start !== oldNote.start) {
                    dirty = true;
                }
            }
            else {
                dirty = true;
            }

            if (pos.note !== oldNote.number) {
                // Change vertical position
                newNote.number = pos.number;
                dirty = true;
            }

            if (dirty) {
                this.strip.moveNote(this.selected, newNote.start, newNote.number);
            }
        }

    }

    if (dirty) {
        this.render();
    }
};

RollView.prototype.upHandler = function (e) {
    var dirty = false;

    this.down = false;
    this.delta = null;
    this.resizing = false;
    this.moving = false;

    var selNote = this.getNoteFromEvent(e);

    if (dirty) {
        this.render();
    }
};

RollView.prototype.dblHandler = function (e) {
    if (this.selected) {
        this.strip.removeNote(this.selected);
        this.selected = undefined;
        this.render();
    }
    else {
        var newNote = this.getPosFromEvent(e);
        if (this.step) {
            newNote.start = Math.floor(newNote.start / this.step) * this.step;
        }
        this.strip.addNote(newNote.start, this.defaultDuration, newNote.number);
        this.render();
    }
};

RollView.prototype.getState = function () {
    return {
        "strip": this.strip,
        "step": this.step,
        "noteDur": this.defaultDuration
    }
}