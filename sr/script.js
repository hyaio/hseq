var PatternView = function (el, options) {
  this.el = el;
  this.patterns = [{
    name: "Pattern 1",
    channel: 1
  }];

}

PatternView.prototype._render = function () {
  var html = "";
  for (var i = 0; i < this.patterns.length; i += 1) {
    html += "<div class='pattern-item pattern-" + i + "'>" + this.patterns[i].name + " [Ch. " + this.patterns[i].channel + "]" + "</div>";  
  }
};

PatternView.prototype.removePattern = function (patternNumber) {
  // Use slice
};

PatternView.prototype.addPattern = function () {
  var patternNumber = this.pattern.length + 1;
};

var PatternSequencer = function (el, options) {
  
  this.data = [[]];
  this.el = el;
  this.ctx = el.getContext("2d");
  this.patternN = options.patternN;
  this.songLen = options.songLen;
  this.patternH = 24;
  this.patternW = 90;
  this.setDimensions();

  this.inset = 2;
  
  this._renderBound = this._render.bind(this);
  this.boundDownHandler = this.downHandler.bind(this);
  el.addEventListener("mousedown", this.boundDownHandler);

  this.render();
  
};

PatternSequencer.prototype.removePattern = function (patternNumber) {
  // Use slice
};

PatternSequencer.prototype.addPattern = function () {
  var patternNumber = this.pattern.length + 1;
};

PatternSequencer.prototype.setSongLen = function (len) {
  this.songLen = len;
};

PatternSequencer.prototype.setPatternNumber = function (patternN) {
  this.patternN = patternN;
};

PatternSequencer.prototype.getPatternPosFromEvent = function (e) {
  var position = Math.floor(e.offsetX / this.patternW);
  var pattern = Math.floor(e.offsetY / this.patternH);
  return {
    pattern: pattern,
    position: position,
  };
};

PatternSequencer.prototype.setDimensions = function () {
  this.tw = this.el.width = this.songLen * this.patternW;
  this.th = this.el.height = this.patternN * this.patternH;
};

PatternSequencer.prototype.setState = function (x,y,val) {
  if (typeof this.data[x] == "undefined") {
    this.data[x] = [];
  }
  this.data[x][y] = val;
};

PatternSequencer.prototype.getState = function (x,y,val) {
  if (typeof this.data[x] == "undefined") {
    return undefined;
  }
  return this.data[x][y];
};

PatternSequencer.prototype.flipState = function (x,y) {
  if (!this.getState(x, y)) {
    this.setState(x, y, true);
  }
  else {
    this.setState(x, y, undefined);
  }
};

PatternSequencer.prototype.downHandler = function (e) {
  var patternPos = this.getPatternPosFromEvent(e);
  this.flipState (patternPos.position, patternPos.pattern);
  this.render();
};

PatternSequencer.prototype._render = function () {

  this.ctx.fillStyle = 'rgb(20,20,20)';
  this.ctx.fillRect(0, 0, this.tw, this.th);

  this.ctx.fillStyle = '#80C5FF';

  for (var i = 0; i < this.data.length; i += 1) {
    if (i > this.songLen || !this.data[i]) continue;
      for (var k = 0; k < this.data[i].length; k+=1) {
        if (k > this.patternN) continue;
        if (this.getState(i,k)) {
          //draw
          console.log ("Drawing",i,k);
          var left = i * this.patternW;
          var width = this.patternW - 1;
          var top = k * this.patternH;
          var height = this.patternH - 1;
          //this.ctx.fillRect(left, top, width, height);

          this.ctx.beginPath();
          this.ctx.moveTo(left, top + this.inset);
          this.ctx.lineTo(left + this.inset, top);
          this.ctx.lineTo(left + width - this.inset, top);
          this.ctx.lineTo(left + width, top + this.inset);
          this.ctx.lineTo(left + width, top + height - this.inset);
          this.ctx.lineTo(left + width - this.inset, top + height);
          this.ctx.lineTo(left + this.inset, top + height);
          this.ctx.lineTo(left, top + height - this.inset);
          this.ctx.fill();


        }
      }
  }
};

PatternSequencer.prototype.render = function () {
  window.requestAnimationFrame(this._renderBound);
};

var psElement = document.querySelector(".pattern-sequencer");
var ps = new PatternSequencer (psElement, {
                                  songLen: 32,
                                  patternN: 16
                                });