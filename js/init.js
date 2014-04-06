var initPlugin = function (args) {

// TODO when the event is unattached, handle the bind

    this.domEl = args.div;
    this.patternList = [];
    this.loop = false;
    this.songLen = 16;

// INIT
    this.PATTERN_N = 16;

// Get elements from the DOM
    this.patternSequencerDiv = this.domEl.querySelector(".pattern-sequencer-main-div");
    this.patternEditorDiv = this.domEl.querySelector(".pattern-editor-container");
    this.backToSeqButton = this.domEl.querySelector(".back-to-seq");
    this.patternMainLabel = this.domEl.querySelector(".pattern-main-label");
    this.resetButton = this.domEl.querySelector(".reset-button");
    this.controlSelector = this.domEl.querySelector(".control-selector");
    this.toggleButton = this.domEl.querySelector(".toggle-loop");
    this.songLengthElement = this.domEl.querySelector(".song-length");

    this.songLengthElement.addEventListener('change', function (e) {
        var sl = parseInt(e.target.value, 10);
        if (sl) {
            this.songLen = sl;
            this.changeSongLength();
        }
        else {
            this.changeSongLength({onlyChangeView: true});
        }
    }.bind(this));

    this.changeSongLength = function (opt) {
        if (opt && opt.syncView) {
            this.songLengthElement.value = this.ps.getSongLen();
            return;
        }
        if (this.ps.getSongLen() !== this.songLen) {
            if (!opt || !opt.onlyChangeView) {
                this.ps.setSongLen(this.songLen);
            }
            this.songLengthElement.value = this.songLen;
        }
    };

    this.toggleButton.addEventListener("click", function () {
        if (!this.loop) {
            this.toggleButton.classList.add('down');
            this.loop = true;
        }
        else {
            this.toggleButton.classList.remove('down');
            this.loop = false;
        }
    }.bind(this));

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
    this.psElement = this.domEl.querySelector(".pattern-sequencer");
    this.ps = new PatternSequencer(this.psElement, {
        songLen: this.songLen,
        patternN: 16
    });
    this.changeSongLength();

    // Generate the pattern list

    for (var p = 0; p < this.PATTERN_N; p += 1) {
        this.patternList.push({
            name: "Pattern " + (p + 1),
            channel: 1,
            strip: new Strip(),
            controls: new ControlModel()
        });
    }

    this.setState = function (state) {

        this.ps.setState(state.sequencer);

        for (var p = 0; p < this.PATTERN_N; p += 1) {
            this.patternList[p].strip.setHash(state.patternList[p].strip);
            this.patternList[p].controls.setState(state.patternList[p].controls);
        }
    };

    if (args.initialState && args.initialState.data) {
        this.setState(args.initialState.data);
    }

    this.changeSongLength({syncView: true});

    this.patternListElement = this.domEl.querySelector(".pattern-list");
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
    this.sheet = this.domEl.querySelector(".sheet");
    this.snapMenu = this.domEl.querySelector(".snap");
    this.durationMenu = this.domEl.querySelector(".newnote");
    this.piano = this.domEl.querySelector(".piano");
    this.controls = this.domEl.querySelector(".controls");

    this.rollView = new RollView(this.sheet);
    this.snapMenu.addEventListener("change", function (e) {
        this.rollView.setStep(parseFloat(e.target.value, 10));
        this.rollView.render();
    }.bind(this));
    this.durationMenu.addEventListener("change", function (e) {
        this.rollView.setDefaultDuration(parseFloat(e.target.value, 10));
    }.bind(this));

    this.pianoView = new PianoView(this.piano, 2, 5);

    this.controlView = new ControlView(this.controls);

    this.getState = function () {
        var state = {
            sequencer: this.ps.getState(),
            patternList: []
        };

        for (var p = 0; p < this.PATTERN_N; p += 1) {
            state.patternList[p] = {};
            state.patternList[p].strip = (this.patternList[p].strip.getHash());
            state.patternList[p].controls = (this.patternList[p].controls.getState());
        }

        return state;
    };

    var saveState = function () {
        return { data: this.getState() };
    };
    args.hostInterface.setSaveState (saveState.bind(this));

    args.hostInterface.setInstanceStatus ('ready');
};