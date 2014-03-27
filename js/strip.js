var Note = function (start, duration, number, id) {
    this.start = start;
    this.duration = duration;
    this.number = number;
    this.id = id;
};
Note.prototype.setStart = function (newStart) {
    this.start = newStart;
};
Note.prototype.setDuration = function (newDuration) {
    this.duration = newDuration;
};
Note.prototype.setNumber = function (newNumber) {
    this.number = newNumber;
};

var Strip = function () {
    this.notesHash = {};
    this.notesArray = [];
};

Strip.prototype.syncSort = function () {
    var sortable = [];
    for (var note in this.notesHash) {
        sortable.push(note.id);
    }
    sortable.sort(function (a, b) {
        return a.start - b.start;
    });
    this.notesArray = sortable;
};

Strip.prototype.addNote = function (start, duration, number) {
    var id = uniqueId();
    this.notesHash[id] = new Note(start, duration, number, id);
    this.syncSort();
    return id;
};

Strip.prototype.getNote = function (id) {
    return this.notesHash[id];
};

Strip.prototype.removeNote = function (id) {
    delete this.notesHash[id];
    this.syncSort();
};

Strip.prototype.resizeNote = function (id, duration) {
    this.notesHash[id].setDuration(duration);
};

Strip.prototype.moveNote = function (id, start, number) {
    if (start !== null) {
        this.notesHash[id].setStart(start);
        this.syncSort();
    }
    if (number !== null) {
        this.notesHash[id].setNumber(number);
    }
};
Strip.prototype.getOrdered = function () {
    return this.notesArray;
};
Strip.prototype.getHash = function () {
    return this.notesHash;
};
Strip.prototype.getNoteAtPosition = function (time, number) {
    for (var key in this.notesHash) {
        var note = this.notesHash[key];
        if (note.number === number) {
            if (note.start < time && (note.start + note.duration) > time) {
                return note;
            }
        }
    }
};