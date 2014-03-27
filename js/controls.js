var ControlModel = function () {
    this.controlData = {
        "cc21": []
    };
    this.current = "cc21";
};
ControlModel.prototype.getData = function () {
    return this.controlData[this.current];
};
ControlModel.prototype.setData = function (data) {
    this.controlData[this.current] = data;
};
ControlModel.prototype.getValue = function (index) {
    return this.controlData[this.current][index];
};
ControlModel.prototype.setValue = function (index, value) {
    this.controlData[this.current][index] = value;
};
ControlModel.prototype.reset = function () {
    this.controlData[this.current] = [];
};
ControlModel.prototype.setCurrent = function (current) {
    this.current = current;
    if (!this.controlData[current]) {
        this.controlData[current] = [];
    }
};
ControlModel.prototype.getCurrent = function () {
    return this.current;
};

var ControlView = function (el) {
    this.el = el;
    this.tw = el.width;
    this.th = el.height;
    this.ctx = el.getContext("2d");
    this.down = false;

    this.controlModel = null;

    this.step = this.tw / 32;

    this._renderBound = this._render.bind(this);

    this.boundDownHandler = this.downHandler.bind(this);
    this.boundMoveHandler = this.moveHandler.bind(this);
    this.boundUpHandler = this.upHandler.bind(this);

    el.addEventListener("mousedown", this.boundDownHandler);
    el.addEventListener("mousemove", this.boundMoveHandler);
    el.addEventListener("mouseup", this.boundUpHandler);

    if (this.controlModel) {
        this.render();
    }

};

ControlView.prototype.render = function () {
    window.requestAnimationFrame(this._renderBound);
};

ControlView.prototype._render = function () {

    var value;

    this.ctx.fillStyle = 'rgb(20,20,20)';
    this.ctx.fillRect(0, 0, this.tw, this.th);

    this.ctx.fillStyle = '#80C5FF';

    var data = this.controlModel.getData();

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

    var bin = Math.floor(e.offsetX / this.step);
    var value = Math.round(((this.th - e.offsetY) / this.th) * 127);

    this.controlModel.setValue(bin, value);

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
    this.controlModel.setCurrent(current);
    this.render();
};

ControlView.prototype.resetCurrent = function (current) {
    this.controlModel.reset();
    this.render();
};

ControlView.prototype.setControlModel = function (cm) {
    this.controlModel = cm;
    this.render();
};