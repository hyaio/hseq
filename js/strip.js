var idCounter = 0,
    uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

var createNote = function (start, duration, number, id) {
    return {
        start: start,
        duration: duration,
        number: number,
        id: id
    };
};

var Strip = function () {
    this.notesHash = {};
    this.notesArray = [];
};

Strip.prototype.syncSort = function () {
    var sortable = [];
    for (var note in this.notesHash) {
        sortable.push(this.notesHash[note]);
    }
    sortable.sort(function (a, b) {
        return a.start - b.start;
    });
    this.notesArray = sortable;
};

Strip.prototype.addNote = function (start, duration, number) {
    var id = uniqueId();
    this.notesHash[id] = createNote(start, duration, number, id);
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
    this.notesHash[id].duration = duration;
};

Strip.prototype.moveNote = function (id, start, number) {
    if (start !== null) {
        this.notesHash[id].start = start;
        this.syncSort();
    }
    if (number !== null) {
        this.notesHash[id].number = number;
    }
};
Strip.prototype.getOrdered = function () {
    return this.notesArray;
};
Strip.prototype.getHash = function () {
    return this.notesHash;
};
Strip.prototype.setHash = function (hash) {
    this.notesHash = hash;
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