var PatternSequencer = function (el, options) {

    this.data = [
        []
    ];
    this.el = el;
    this.ctx = el.getContext("2d");
    this.patternN = options.patternN;
    this.songLen = options.songLen;
    this.patternH = 23;
    this.patternW = 90;
    this.timeTrackH = 22;
    this.setDimensions();

    this.inset = 2;

    this._renderBound = this._render.bind(this);
    this.boundDownHandler = this.downHandler.bind(this);
    el.addEventListener("mousedown", this.boundDownHandler);

    this.render();

};

PatternSequencer.prototype.erase = function () {
    this.data = [
        []
    ];
};

PatternSequencer.prototype.setSongLen = function (len) {
    this.songLen = len;
};

PatternSequencer.prototype.setPatternNumber = function (patternN) {
    this.patternN = patternN;
};

PatternSequencer.prototype.getPatternPosFromEvent = function (e) {
    // Avoid clicks on the time tracker
    if (e.offsetY >= (this.th - this.timeTrackH)) {
        return null;
    }
    var position = Math.floor(e.offsetX / this.patternW);
    var pattern = Math.floor(e.offsetY / this.patternH);
    return {
        pattern: pattern,
        position: position,
    };
};

PatternSequencer.prototype.setDimensions = function () {
    this.tw = this.el.width = this.songLen * this.patternW;
    this.th = this.el.height = this.patternN * this.patternH + this.timeTrackH;
};

PatternSequencer.prototype.setState = function (x, y, val) {
    if (typeof this.data[x] == "undefined") {
        this.data[x] = [];
    }
    this.data[x][y] = val;
};

PatternSequencer.prototype.getState = function (x, y, val) {
    if (typeof this.data[x] == "undefined") {
        return undefined;
    }
    return this.data[x][y];
};

PatternSequencer.prototype.flipState = function (x, y) {
    if (!this.getState(x, y)) {
        this.setState(x, y, true);
    }
    else {
        this.setState(x, y, undefined);
    }
};

PatternSequencer.prototype.downHandler = function (e) {
    var patternPos = this.getPatternPosFromEvent(e);
    if (!patternPos) {
        return;
    }
    this.flipState(patternPos.position, patternPos.pattern);
    this.render();
};

PatternSequencer.prototype._render = function () {

    this.ctx.fillStyle = 'rgb(20,20,20)';
    this.ctx.fillRect(0, 0, this.tw, this.th - this.timeTrackH);

    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(0, this.th - this.timeTrackH, this.tw, this.th);

    this.ctx.fillStyle = '#80A500';

    for (var i = 0; i < this.data.length; i += 1) {
        if (i > this.songLen || !this.data[i]) continue;
        for (var k = 0; k < this.data[i].length; k += 1) {
            if (k > this.patternN) continue;
            if (this.getState(i, k)) {
                //Draw
                var left = i * this.patternW;
                var width = this.patternW - 1;
                var top = k * this.patternH;
                var height = this.patternH - 1;

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
                this.ctx.closePath();
            }
        }
    }

    this.ctx.strokeStyle = 'rgb(45, 45, 45)';
    this.ctx.fillStyle = 'rgb(200, 200, 200)'
    // Render grid and text
    this.ctx.beginPath();
    var txt = 0;
    for (var x = 0; x <= this.tw; x += this.patternW) {
        // grid
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.th);

        // text
        this.ctx.font = "12px 'Exo 2'";
        this.ctx.fillText(txt, x + 5, this.th - 5);
        txt += 2;
    }
    this.ctx.stroke();
};

PatternSequencer.prototype.render = function () {
    window.requestAnimationFrame(this._renderBound);
};