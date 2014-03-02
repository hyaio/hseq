var SEMIBREVE = 4, // (bar)
    MINIMA = 2, // (half bar)
    SEMIMINIMA = 1, // (quarter bar)
    CROMA = 0.5, // (1/8 bar)
    SEMICROMA = 0.25 // (1/16 bar)

var idCounter = 0,
  uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

// MODEL DEFINITION
var Note = function (start, duration, number) {
  this.start = start;
  this.duration = duration;
  this.number = number;
}
Note.prototype.setStart = function (newStart) {
  this.start = newStart;
}
Note.prototype.setDuration = function (newDuration) {
  this.duration = newDuration;
}
Note.prototype.setNumber = function (newNumber) {
  this.number = newNumber;
}
var Strip = function () {
  this.notesHash = {};
  this.notesArray = [];
}
Strip.prototype.syncSort = function () {
  var sortable = [];
  for (var note in this.notesHash) {
      sortable.push(note.id);
  }
  sortable.sort(function(a, b) {return a.start - b.start});
  this.notesArray = sortable;
};

Strip.prototype.addNote = function (start, duration, number) {
  var id = uniqueId ();
  this.notesHash[id] = new Note (start, duration, number);
  this.syncSort();
  return id;
};

Strip.prototype.removeNote = function (id) {
  delete this.notesHash[id];
  this.syncSort();
} 
Strip.prototype.resizeNote = function (id, duration) {
  notesHash[id].setDuration(duration);
}
Strip.prototype.moveNote = function (id, start, number) {
  if (start !== null) {
    notesHash[id].setStart(start);
    this.syncSort();
  }
  if (number !== null) {
    notesHash[id].setNumber(number);
  }
}
Strip.prototype.getOrdered = function () {
  return this.notesArray;  
}
Strip.prototype.getHash = function () {
  return this.notesHash;
}
Strip.prototype.getNoteAtPosition = function (time, number) {
  for (var note in this.notesHash) {
    if (note.number === number) {
      if (note.start < time && (note.start + note.duration) > time) {
        return note;
      }
    }
  }

}

// VIEW
var RollView = function (viewW, viewH, context) {
  this.th = viewH;
  this.tw = viewW;
  this.ctx = context;
  this.strip = new Strip();
  this.noteHeight = Math.round(viewH / (5 * 12));
  this.noteWidth = Math.round(viewW / (4 * 32));

  // TODO THIS IS TEST CODE
  this.strip.addNote (0, CROMA, 36);
  this.strip.addNote (0.5, CROMA, 36);
  this.strip.addNote (1, MINIMA, 38);
  this.render ();
}

RollView.prototype.render = function () {

  var notes = this.strip.getHash();

  //ctx.fillStyle = "orange";
  
  for (var n in notes) {
    
    var note = notes[n];
    var left = note.start * this.noteWidth ;
    var width = note.duration * this.noteWidth  - 1;
    var top = this.th - (note.number * this.noteHeight);
    var height = this.noteHeight - 1;
    
    // add linear gradient TODO
    var grd = this.ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, '#FF8500');   
    grd.addColorStop(1, '#FFC500');
    this.ctx.fillStyle = grd;
    
    this.ctx.fillRect(left, top, width, height); 
  }
};


// INIT
var sheet = document.querySelector("#sheet");
var ctx = sheet.getContext("2d");

var rollView = new RollView (sheet.width, sheet.height, ctx);

