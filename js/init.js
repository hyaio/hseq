// INIT
var patternList = [
    {
        name: "Pattern 1",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 2",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 3",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 4",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 5",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 6",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 7",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 8",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 9",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 10",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 11",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 12",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 13",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 14",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 15",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    },
    {
        name: "Pattern 16",
        channel: 1,
        strip: new Strip(),
        controls: new ControlModel()
    }
];

// GET THE CONTAINER ELEMENTS
var patternSequencerDiv = document.querySelector("#pattern-sequencer-main-div");
var patternEditorDiv = document.querySelector("#pattern-editor-container");
var backToSeqButton = document.querySelector(".back-to-seq");
var patternMainLabel = document.querySelector(".pattern-main-label");
var resetButton = document.querySelector(".reset-button");
var controlSelector = document.querySelector("#control-selector");

backToSeqButton.addEventListener("click", function () {
    patternSequencerDiv.classList.remove("hidden");
    patternEditorDiv.classList.add("hidden");
});

resetButton.addEventListener("click", function () {
    controlView.resetCurrent();
});

controlSelector.addEventListener("change", function (e) {
    controlView.setCurrent(e.target.value);
});

// INIT SEQUENCER
var psElement = document.querySelector(".pattern-sequencer");
var ps = new PatternSequencer(psElement, {
    songLen: 32,
    patternN: 16
});

var patternListElement = document.querySelector(".pattern-list");
var pv = new PatternView(patternListElement, {
    patternButtonCallback: function (pattern) {

        var patternObj = pv.getPattern(pattern);
        rollView.setStrip(patternObj.strip);

        controlView.setControlModel(patternObj.controls);
        controlSelector.value = patternObj.controls.getCurrent();

        patternMainLabel.innerHTML = patternObj.name;

        patternSequencerDiv.classList.add("hidden");
        patternEditorDiv.classList.remove("hidden");
    },
    patterns: patternList
});

// INIT PATTERN EDITOR
var sheet = document.querySelector("#sheet");
var snapMenu = document.querySelector("#snap");
var durationMenu = document.querySelector("#newnote");
var piano = document.querySelector("#piano");
var controls = document.querySelector("#controls");

var rollView = new RollView(sheet);
snapMenu.addEventListener("change", function (e) {
    rollView.setStep(parseFloat(e.target.value, 10));
    rollView.render();
});
durationMenu.addEventListener("change", function (e) {
    rollView.setDefaultDuration(parseFloat(e.target.value, 10));
});

var pianoView = new PianoView(piano, 2, 5);

var controlView = new ControlView(controls);