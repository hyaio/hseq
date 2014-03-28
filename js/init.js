var pluginFunction = function () {

// TODO when the event is unattached, handle the bind

// INIT
    this.PATTERN_N = 16;

// generate the pattern list
    this.patternList = [];

    for (var p = 0; p < this.PATTERN_N; p += 1) {
        this.patternList.push({
            name: "Pattern " + (p + 1),
            channel: 1,
            strip: new Strip(),
            controls: new ControlModel()
        });

    }

// Get elements from the DOM
    this.patternSequencerDiv = document.querySelector(".pattern-sequencer-main-div");
    this.patternEditorDiv = document.querySelector(".pattern-editor-container");
    this.backToSeqButton = document.querySelector(".back-to-seq");
    this.patternMainLabel = document.querySelector(".pattern-main-label");
    this.resetButton = document.querySelector(".reset-button");
    this.controlSelector = document.querySelector("#control-selector");

    this.backToSeqButton.addEventListener("click", function () {
        this.patternSequencerDiv.classList.remove("hidden");
        this.patternEditorDiv.classList.add("hidden");
    }.bind(this));

    this.resetButton.addEventListener("click", function () {
        this.controlView.resetCurrent();
    }.bind(this));

    this.controlSelector.addEventListener("change", function (e) {
        this.controlView.setCurrent(e.target.value);
    }.bind(this));

// INIT SEQUENCER
    this.psElement = document.querySelector(".pattern-sequencer");
    this.ps = new PatternSequencer(this.psElement, {
        songLen: 32,
        patternN: 16
    });

    this.patternListElement = document.querySelector(".pattern-list");
    this.pv = new PatternView(this.patternListElement, {
        patternButtonCallback: function (pattern) {

            var patternObj = this.pv.getPattern(pattern);
            this.rollView.setStrip(patternObj.strip);

            this.controlView.setControlModel(patternObj.controls);
            this.controlSelector.value = patternObj.controls.getCurrent();

            this.patternMainLabel.innerHTML = patternObj.name;

            this.patternSequencerDiv.classList.add("hidden");
            this.patternEditorDiv.classList.remove("hidden");
        }.bind(this),
        patterns: this.patternList
    });

// INIT PATTERN EDITOR
    this.sheet = document.querySelector("#sheet");
    this.snapMenu = document.querySelector(".snap");
    this.durationMenu = document.querySelector(".newnote");
    this.piano = document.querySelector("#piano");
    this.controls = document.querySelector("#controls");

    this.rollView = new RollView(sheet);
    this.snapMenu.addEventListener("change", function (e) {
        this.rollView.setStep(parseFloat(e.target.value, 10));
        this.rollView.render();
    }.bind(this));
    this.durationMenu.addEventListener("change", function (e) {
        this.rollView.setDefaultDuration(parseFloat(e.target.value, 10));
    }.bind(this));

    this.pianoView = new PianoView(piano, 2, 5);

    this.controlView = new ControlView(controls);
};

var plugin = new pluginFunction();