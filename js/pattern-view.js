var PatternView = function (el, options) {
    this.el = el;
    this.patternButtonCallback = options.patternButtonCallback;
    this.patterns = options.patterns;

    this.render();

    this.boundDownHandlerDelegator = this._downHandlerDelegator.bind(this);
    el.addEventListener("mousedown", this.boundDownHandlerDelegator);

};

PatternView.prototype.getPattern = function (pattern) {
    return this.patterns[pattern];
};

PatternView.prototype._downHandlerDelegator = function (e) {
    if (e.target && e.target.nodeName == "BUTTON") {
        // TODO maybe loop over the classes and use indexof to see if it's the right class
        // TODO TODO TODO dataset API http://davidwalsh.name/element-dataset
        // e.target.classList[1].regex = ["3"], for instance.
        var patternNum = parseInt(e.target.classList[1].match(/\d+/g)[0]);
        this.patternButtonCallback(patternNum);
    }
};

PatternView.prototype.render = function () {

    var html = "";
    for (var i = 0; i < this.patterns.length; i += 1) {
        html += "<div class='pattern-item pattern-" + i + "'><span class='pattern-name'>" + this.patterns[i].name + "</span>" + "<span class='pattern-num'>" + this.patterns[i].channel + "</span>" + "<button class='edit edit-pattern-" + i + "''>Edit..</button>" + "</div>";
    }
    this.el.innerHTML = html;
};

PatternView.prototype.removePattern = function (patternNumber) {
    // Use slice
};

PatternView.prototype.addPattern = function () {
    var patternNumber = this.pattern.length + 1;
};