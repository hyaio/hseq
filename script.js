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
  this.step = CROMA;
  this.defaultDuration = SEMIMINIMA;
  this.delta = null;
  this.mode = "EDIT" /* "ADD", "REMOVE" */;
  this.resizing = false;
  this.moving = false;
  this._renderBound = this._render.bind(this);

  this.strip = new Strip();
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
    var left = note.start * this.noteWidth ;
    var width = note.duration * this.noteWidth  - 1;
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

  // If this is a dragging event and some note is selected
  if (this.down && this.selected) {
    console.log ("bring the action!");

    var pos = this.getPosFromEvent (e);
    
    var oldNote = this.strip.getNote (this.selected);
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
      this.strip.resizeNote (this.selected, newDuration);
      dirty = true;

    }
    // else do the move
    else {
      this.moving = true;
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

  var selNote = this.getNoteFromEvent (e);

  if (dirty) {
    this.render();
  }
};

RollView.prototype.dblHandler = function (e) {
  if (this.selected) {
    this.strip.removeNote (this.selected);
    this.selected = undefined;
    this.render();
  }
  else {
    var newNote = this.getPosFromEvent (e);
    if (this.step) {
      newNote.start = Math.floor(newNote.start / this.step) * this.step;
    }
    this.strip.addNote (newNote.start, this.defaultDuration, newNote.number);
    this.render();
  }
};

var PianoView = function (el, minOct, octaves) {
  this.el = el;
  this.tw = el.width;
  this.th = el.height;
  this.ctx = el.getContext("2d");
  this.minOct = minOct;
  this.octaves = octaves;

  var keyboardNotes = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];

  var nNotes = octaves * 12;

  for (var i = 0; i < nNotes; i+=1) {

    var noteName = keyboardNotes[i % 12];
    var oct = minOct + (octaves - Math.floor (i/12)) - 1;

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

}

var ControlModel = function () {
  this.data = [];
}
ControlModel.prototype.getData = function () {
  return this.data;
}
ControlModel.prototype.setData = function (data) {
  this.data = data;
}
ControlModel.prototype.getValue = function (index) {
  return this.data[index];
}
ControlModel.prototype.setValue = function (index, value) {
  this.data[index] = value;
}

var ControlView = function (el) {
  this.el = el;
  this.tw = el.width;
  this.th = el.height;
  this.ctx = el.getContext("2d");
  this.down = false;

  this.controlData = {
    "cc21": new ControlModel(),
    "cc22": new ControlModel(),
    "cc23": new ControlModel(),
    "cc24": new ControlModel(),
    "cc25": new ControlModel(),
    "cc26": new ControlModel(),
    "cc27": new ControlModel(),
    "cc28": new ControlModel(),
  };

  this.currentController = "cc21";

  this.step = this.tw / 32;

  this._renderBound = this._render.bind(this);

  this.boundDownHandler = this.downHandler.bind(this);
  this.boundMoveHandler = this.moveHandler.bind(this);
  this.boundUpHandler = this.upHandler.bind(this);

  el.addEventListener("mousedown", this.boundDownHandler);
  el.addEventListener("mousemove", this.boundMoveHandler);
  el.addEventListener("mouseup", this.boundUpHandler);

  this.render();

};

ControlView.prototype.render = function () {
  window.requestAnimationFrame(this._renderBound);
};

ControlView.prototype._render = function () {

  var value;

  this.ctx.fillStyle = 'rgb(20,20,20)';
  this.ctx.fillRect(0, 0, this.tw, this.th);

  this.ctx.fillStyle = '#80C5FF';

  var data = this.controlData[this.currentController].getData();

  for (var i = 0; i < data.length; i += 1) {
    value = data[i];
    if (value) {
      var left = i * this.step;
      var width = 8;
      var top = this.th - ((value / 127) * this.th);
      var height = this.th - top;
      this.ctx.fillRect(left, top, width, height);
    }
  }

};

ControlView.prototype._calculate = function (e) {

  var bin = Math.floor (e.offsetX / this.step);
  var value = Math.round(((this.th - e.offsetY) / this.th) * 127);

  this.controlData[this.currentController].setValue (bin, value);

}

ControlView.prototype.downHandler = function (e) {
  this.down = true;

  this._calculate(e);
  this.render();
};

ControlView.prototype.upHandler = function () {
  this.down = false;
};

ControlView.prototype.moveHandler = function (e) {
  if (this.down) {
    this._calculate(e);
    this.render();
  }
};

ControlView.prototype.setCurrent = function (current) {
  this.currentController = current;
  this.render();
}

// INIT
var sheet = document.querySelector("#sheet");
var snapMenu = document.querySelector("#snap");
var durationMenu = document.querySelector("#newnote");
var piano = document.querySelector("#piano");
var controls = document.querySelector("#controls");

var rollView = new RollView (sheet);
snapMenu.addEventListener("change", function (e) {
  rollView.setStep (parseFloat(e.target.value, 10));
  rollView.render();
});
durationMenu.addEventListener("change", function (e) {
  rollView.setDefaultDuration (parseFloat(e.target.value, 10));
});

var pianoView = new PianoView (piano, 2, 5);

var controlView = new ControlView (controls);

