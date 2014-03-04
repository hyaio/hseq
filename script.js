var SEMIBREVE = 4, // (bar)
    MINIMA = 2, // (half bar)
    SEMIMINIMA = 1, // (quarter bar)
    CROMA = 0.5, // (1/8 bar)
    SEMICROMA = 0.25; // (1/16 bar)

var idCounter = 0,
  uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

var getEventPosition = function (e, obj) {
  var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(obj, null).paddingLeft, 10) || 0;
  var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(obj, null).paddingTop, 10) || 0;
  var styleBorderLeft = parseInt(document.defaultView.getComputedStyle(obj, null).borderLeftWidth, 10) || 0;
  var styleBorderTop = parseInt(document.defaultView.getComputedStyle(obj, null).borderTopWidth, 10) || 0;
  var html = document.body.parentNode;
  var htmlTop = html.offsetTop;
  var htmlLeft = html.offsetLeft;


  var element = obj,
      offsetX = 0,
      offsetY = 0,
      mx, my;

  // Compute the total offset
  if (typeof element.offsetParent !== 'undefined') {
      do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // this returns in element's css value, without borders
  var cssWidth = parseInt(document.defaultView.getComputedStyle(obj, null).getPropertyValue("width"), 10) || 0;
  var cssHeight = parseInt(document.defaultView.getComputedStyle(obj, null).getPropertyValue("height"), 10) || 0;

  //var cssWidth  = obj.offsetWidth;
  //var cssHeight = obj.offsetHeight;

  var attrWidth = obj.getAttribute("width");
  var attrHeight = obj.getAttribute("height");
  var widthScale = attrWidth / cssWidth;
  var heightScale = attrHeight / cssHeight;
  //console.log ('*** SCALE', widthScale, heightScale);

  mx *= widthScale;
  my *= heightScale;

  // We return a simple javascript object (a hash) with x and y defined
  return {
      x: mx,
      y: my
  };
};

// MODEL DEFINITION
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
  sortable.sort(function(a, b) {return a.start - b.start;});
  this.notesArray = sortable;
};

Strip.prototype.addNote = function (start, duration, number) {
  var id = uniqueId ();
  this.notesHash[id] = new Note (start, duration, number, id);
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

// VIEW
var RollView = function (el) {
  this.el = el;
  this.tw = el.width;
  this.th = el.height;
  this.ctx = el.getContext("2d");
  this.down = false;
  this.step =  SEMIMINIMA /*0*/;
  this.delta = null;

  this.strip = new Strip();
  this.noteHeight = Math.round(this.th / (5 * 12));
  this.noteWidth = Math.round(this.tw / (4 * 32));
  this.boundDownHandler = this.downHandler.bind(this);
  this.boundMoveHandler = this.moveHandler.bind(this);
  this.boundUpHandler = this.upHandler.bind(this);

  el.addEventListener("mousedown", this.boundDownHandler);
  el.addEventListener("mousemove", this.boundMoveHandler);
  el.addEventListener("mouseup", this.boundUpHandler);

  // TODO THIS IS TEST CODE
  this.strip.addNote (0, CROMA, 36);
  this.strip.addNote (0.5, CROMA, 36);
  this.strip.addNote (1, MINIMA, 38);
  this.render ();
};

RollView.prototype.setStep = function (step) {
  this.step = step;
};

RollView.prototype.render = function () {

  var notes = this.strip.getHash();
  this.ctx.fillStyle = 'rgb(60,60,60)';
  this.ctx.fillRect(0, 0, this.tw, this.th);
  
  for (var n in notes) {
    
    var note = notes[n];
    var left = note.start * this.noteWidth ;
    var width = note.duration * this.noteWidth  - 1;
    var top = this.th - (note.number * this.noteHeight);
    var height = this.noteHeight - 1;
    
    // add linear gradient TODO
    if (this.selected && note.id === this.selected) {
      this.ctx.fillStyle = 'OrangeRed';
    }
    else {
      this.ctx.fillStyle = '#FFC500';
    }
    
    this.ctx.fillRect(left, top, width, height);
  }
};

RollView.prototype.getPosFromEvent = function (e) {
  var pos = getEventPosition (e, this.el);
  var start = e.offsetX / this.noteWidth;
  var number = Math.ceil((this.th - e.offsetY) / this.noteHeight);
  return {
    start: start,
    number: number,
  };
};

RollView.prototype.getNoteFromEvent = function (e) {
  
  var pos = this.getPosFromEvent (e);
  
  return this.strip.getNoteAtPosition (pos.start, pos.number);
};

RollView.prototype.downHandler = function (e) {
  
  var dirty = false;

  var selNote = this.getNoteFromEvent (e);

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

  var selNote = this.getNoteFromEvent (e);

  if (this.down && this.selected) {
    console.log ("bring the action!");

    var pos = this.getPosFromEvent (e);
    
    var oldNote = this.strip.getNote (this.selected);
    var delta = pos.start - oldNote.start;

    var newNote = {
      start : oldNote.start,
      number: oldNote.number,
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
      this.strip.moveNote (this.selected, newNote.start, newNote.number);
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

  var selNote = this.getNoteFromEvent (e);

  /*this.selected = undefined;
  dirty = true;*/

  if (dirty) {
    this.render();
  }
};


// INIT
var sheet = document.querySelector("#sheet");

var rollView = new RollView (sheet);

