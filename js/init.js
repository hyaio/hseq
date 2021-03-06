var initPlugin = function (args) {

// TODO when the event is unattached, handle the bind

    this.context = args.audioContext;
    this.midiHandler = args.MIDIHandler;
    this.domEl = args.div;
    this.patternList = [];
    this.loop = false;
    this.songLen = 16;
    this.bpm = 90;
    this.playing  = false;

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
    this.bpmElement = this.domEl.querySelector(".bpm");
    this.playSongElement = this.domEl.querySelector(".play-button-song");
    this.playPatternElement = this.domEl.querySelector(".play-button-pattern");
    this.channelElement = this.domEl.querySelector(".channel");

    // Channel
    this.channelElement.addEventListener('change', function (e) {
        this.patternList[this.currentPattern].channel = e.target.value;
    }.bind(this));

    // Play element
    this.patternScheduler = new Scheduler ({
            el: this.playPatternElement
        },
        this.midiHandler,
        this.context
    );

    this.playSongElement.addEventListener('click', function (e) {
       if (this.playing) {
           this.playSongElement.innerHTML = "Wait &#9640;";
           this.patternScheduler.stop();
       }
       else {
           this.playing = true;
           this.playSongElement.innerHTML = "Stop &#9724;";
           this.patternScheduler.playSong(
               this.ps.getState(),
               this.loop,
               function () {
                   if (this.playing) {
                       this.playing = false;
                   }
                   this.playSongElement.innerHTML = "Play &#9654;";
               }.bind(this),
               this.bpm,
               this.patternList,
               this.pv
            );
       }
    }.bind(this));

    this.playPatternElement.addEventListener('click', function (e) {
        if (!this.playing) {
            this.playing = true;
            this.playPatternElement.innerHTML = "Wait &#9640";
            var strip = this.rollView.getStrip();
            this.patternScheduler.playPattern(strip,
                this.patternList[this.currentPattern].controls.getState().controlData,
                function () {
                    this.playing = false;
                    this.playPatternElement.innerHTML = "Play &#9654;";
                    if (this.playSongElement.innerHTML.indexOf("Wait") === 0) {
                        this.playSongElement.innerHTML = "Play &#9654;";
                    }
                    this.patternScheduler.stop();
                }.bind(this),
                this.bpm,
                this.patternList[this.currentPattern].channel
            );
        }


    }.bind(this));

    // Song length input
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

    // BPM input
    this.bpmElement.addEventListener('change', function (e) {
        var bpm = parseInt(e.target.value, 10);
        if (bpm && (bpm >= 10 && bpm <=180)) {
            this.bpm = bpm;
        }
        else {
            this.changeBpm();
        }
    }.bind(this));

    this.changeBpm = function () {
        this.bpmElement.value = this.bpm;
    };

    // Toggle loop button
    this.toggleButton.addEventListener("click", function () {
        if (!this.loop) {
            this.loop = true;
        }
        else {
            this.loop = false;
        }
        this.changeLoopToggle();
    }.bind(this));

    this.changeLoopToggle = function () {
        if (this.loop) {
            this.toggleButton.classList.add('down');
            this.patternScheduler.setLoop(true);
        }
        else {
            this.toggleButton.classList.remove('down');
            this.patternScheduler.setLoop(false);
        }
    };

    this.backToSeqButton.addEventListener("click", function () {
        this.currentPattern = null;
        this.patternSequencerDiv.classList.remove("hidden");
        this.patternEditorDiv.classList.add("hidden");
        this.pv.render();
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

        this.loop = state.loop;
        this.bpm = state.bpm;
        this.ps.setState(state.sequencer);

        for (var p = 0; p < this.PATTERN_N; p += 1) {
            this.patternList[p].strip.setHash(state.patternList[p].strip);
            this.patternList[p].controls.setState(state.patternList[p].controls);
            this.patternList[p].channel = state.patternList[p].channel;
        }
    };

    if (args.initialState && args.initialState.data) {
        this.setState(args.initialState.data);
    }

    // Changing the input values
    this.changeSongLength({syncView: true});
    this.changeBpm();
    this.changeLoopToggle();

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

            this.channelElement.value = this.patternList[pattern].channel;
            this.currentPattern = pattern;
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
            patternList: [],
            bpm: this.bpm,
            loop: this.loop
        };

        for (var p = 0; p < this.PATTERN_N; p += 1) {
            state.patternList[p] = {};
            state.patternList[p].strip = (this.patternList[p].strip.getHash());
            state.patternList[p].controls = (this.patternList[p].controls.getState());
            state.patternList[p].channel = this.patternList[p].channel;
        }

        return state;
    };

    var saveState = function () {
        return { data: this.getState() };
    };
    args.hostInterface.setSaveState (saveState.bind(this));

    args.hostInterface.setInstanceStatus ('ready');
};