define(["require","github:pieroxy/lz-string@master/libs/lz-string-1.3.3-min","./index.html!text","./style.css!text","#google Exo 2:400,200,300 !font"],function(a,b,c,d){var e={name:"Hya Sequencer",version:"0.0.1",hyaId:"HSEQ",ui:{type:"div",width:600,height:460,html:c,css:d}},f=function(a,b){var c,d,e=parseInt(document.defaultView.getComputedStyle(b,null).paddingLeft,10)||0,f=parseInt(document.defaultView.getComputedStyle(b,null).paddingTop,10)||0,g=parseInt(document.defaultView.getComputedStyle(b,null).borderLeftWidth,10)||0,h=parseInt(document.defaultView.getComputedStyle(b,null).borderTopWidth,10)||0,i=document.body.parentNode,j=i.offsetTop,k=i.offsetLeft,l=b,m=0,n=0;if("undefined"!=typeof l.offsetParent)do m+=l.offsetLeft,n+=l.offsetTop;while(l=l.offsetParent);m+=e+g+k,n+=f+h+j,c=a.pageX-m,d=a.pageY-n;var o=parseInt(document.defaultView.getComputedStyle(b,null).getPropertyValue("width"),10)||0,p=parseInt(document.defaultView.getComputedStyle(b,null).getPropertyValue("height"),10)||0,q=b.getAttribute("width"),r=b.getAttribute("height"),s=q/o,t=r/p;return c*=s,d*=t,{x:c,y:d}},g=0,h=function(a){var b=++g+"";return a?a+b:b},i=function(a,b,c,d){return{start:a,duration:b,number:c,id:d}},j=function(){this.notesHash={},this.notesArray=[]};j.prototype.syncSort=function(){var a=[];for(var b in this.notesHash)a.push(this.notesHash[b]);a.sort(function(a,b){return a.start-b.start}),this.notesArray=a},j.prototype.addNote=function(a,b,c){var d=h();return this.notesHash[d]=i(a,b,c,d),this.syncSort(),d},j.prototype.getNote=function(a){return this.notesHash[a]},j.prototype.removeNote=function(a){delete this.notesHash[a],this.syncSort()},j.prototype.resizeNote=function(a,b){this.notesHash[a].duration=b},j.prototype.moveNote=function(a,b,c){null!==b&&(this.notesHash[a].start=b,this.syncSort()),null!==c&&(this.notesHash[a].number=c)},j.prototype.getOrdered=function(){return this.notesArray},j.prototype.getHash=function(){return this.notesHash},j.prototype.setHash=function(a){this.notesHash=a},j.prototype.getNoteAtPosition=function(a,b){for(var c in this.notesHash){var d=this.notesHash[c];if(d.number===b&&d.start<a&&d.start+d.duration>a)return d}};var k=1,l=.5,m=.25,n=function(a,b){this.name="",this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.down=!1,this.step=l,this.defaultDuration=k,this.delta=null,this.resizing=!1,this.moving=!1,this._renderBound=this._render.bind(this),this.strip=b,this.noteHeight=Math.round(this.th/60),this.noteWidth=this.tw/8,this.boundDownHandler=this.downHandler.bind(this),this.boundMoveHandler=this.moveHandler.bind(this),this.boundUpHandler=this.upHandler.bind(this),this.boundDblHandler=this.dblHandler.bind(this),this.boundMouseOutHandler=this.mouseOutHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),a.addEventListener("mousemove",this.boundMoveHandler),a.addEventListener("mouseup",this.boundUpHandler),a.addEventListener("dblclick",this.boundDblHandler),a.addEventListener("mouseout",this.boundMouseOutHandler),this.strip&&this.render()};n.prototype.setStrip=function(a){this.strip=a,this.render()},n.prototype.getStrip=function(){return this.strip},n.prototype.setStep=function(a){this.step=a},n.prototype.setDefaultDuration=function(a){this.defaultDuration=a},n.prototype._renderGrid=function(){var a=this.noteWidth*this.step;if(this.ctx.beginPath(),this.step)for(var b=0;b<=this.tw;b+=a)this.ctx.moveTo(b,0),this.ctx.lineTo(b,this.th);for(var c=0;c<=this.th;c+=this.noteHeight)this.ctx.moveTo(0,c),this.ctx.lineTo(this.tw,c);this.ctx.strokeStyle="rgba(255, 255, 255, 0.1)",this.ctx.stroke()},n.prototype._render=function(){var a=null,b=this.strip.getHash();this.ctx.fillStyle="rgb(30,30,30)",this.ctx.fillRect(0,0,this.tw,this.th),this._renderGrid();for(var c in b){var d=b[c],e=d.start*this.noteWidth,f=d.duration*this.noteWidth-1,g=this.th-d.number*this.noteHeight,h=this.noteHeight-1;this.selected&&d.id===this.selected?a={left:e,top:g,width:f,height:h}:(this.ctx.fillStyle="#FFC500",this.ctx.fillRect(e,g,f,h))}a&&(this.ctx.fillStyle="OrangeRed",this.ctx.fillRect(a.left,a.top,a.width,a.height))},n.prototype.render=function(){window.requestAnimationFrame(this._renderBound)},n.prototype.getPosFromEvent=function(a){var b=(f(a,this.el),a.offsetX/this.noteWidth),c=Math.ceil((this.th-a.offsetY)/this.noteHeight);return{start:b,number:c}},n.prototype.getNoteFromEvent=function(a){var b=this.getPosFromEvent(a);return this.strip.getNoteAtPosition(b.start,b.number)},n.prototype.downHandler=function(a){var b=!1,c=this.getNoteFromEvent(a);c?(this.selected=c.id,this.down=!0,b=!0):this.selected&&(this.selected=void 0,b=!0),b&&this.render()},n.prototype.moveHandler=function(a){{var b=!1;this.getNoteFromEvent(a)}if(this.down&&this.selected){console.log("bring the action!");var c=this.getPosFromEvent(a),d=this.strip.getNote(this.selected),e=c.start-d.start;if(!this.moving&&(this.resizing||e>.8*d.duration)){this.resizing=!0;var f=e;this.step&&(f=Math.round(f/this.step)*this.step),f<this.step&&(f=d.duration,b=!1),m/2>f&&(f=m/2),this.strip.resizeNote(this.selected,f),b=!0}else{this.moving=!0;var g={start:d.start,number:d.number};null===this.delta&&(this.delta=e),g.start=c.start-this.delta,this.step?(g.start=Math.round(g.start/this.step)*this.step,g.start!==d.start&&(b=!0)):b=!0,c.note!==d.number&&(g.number=c.number,b=!0),b&&this.strip.moveNote(this.selected,g.start,g.number)}}b&&this.render()},n.prototype.upHandler=function(a){var b=!1;this.down=!1,this.delta=null,this.resizing=!1,this.moving=!1;this.getNoteFromEvent(a);b&&this.render()},n.prototype.dblHandler=function(a){if(this.selected)this.strip.removeNote(this.selected),this.selected=void 0,this.render();else{var b=this.getPosFromEvent(a);this.step&&(b.start=Math.floor(b.start/this.step)*this.step),this.strip.addNote(b.start,this.defaultDuration,b.number),this.render()}},n.prototype.mouseOutHandler=function(a){console.log("Mouse out"),this.upHandler(a)},n.prototype.getState=function(){return{strip:this.strip,step:this.step,noteDur:this.defaultDuration}};var o=function(a,b,c){this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.minOct=b,this.octaves=c;for(var d=["B","A#","A","G#","G","F#","F","E","D#","D","C#","C"],e=12*c,f=0;e>f;f+=1){var g=d[f%12],h=b+(c-Math.floor(f/12))-1,i="#"===g.charAt(1);this.ctx.fillStyle=i?"black":"white";var j=this.tw,k=this.th/e,l=f*k,m=0;this.ctx.fillRect(m,l,j,k-1),this.ctx.fillStyle=i?"white":"black";var n=g+" "+h;this.ctx.font="12px 'Exo 2'",this.ctx.fillText(n,20,l+18)}},p=function(){this.controlData={cc21:[]},this.current="cc21"};p.prototype.getState=function(){return{controlData:this.controlData,current:this.current}},p.prototype.setState=function(a){this.controlData=a.controlData,this.current=a.current},p.prototype.getData=function(){return this.controlData[this.current]},p.prototype.setData=function(a){this.controlData[this.current]=a},p.prototype.getValue=function(a){return this.controlData[this.current][a]},p.prototype.setValue=function(a,b){this.controlData[this.current][a]=b},p.prototype.reset=function(){this.controlData[this.current]=[]},p.prototype.setCurrent=function(a){this.current=a,this.controlData[a]||(this.controlData[a]=[])},p.prototype.getCurrent=function(){return this.current};var q=function(a){this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.down=!1,this.controlModel=null,this.step=this.tw/32,this._renderBound=this._render.bind(this),this.boundDownHandler=this.downHandler.bind(this),this.boundMoveHandler=this.moveHandler.bind(this),this.boundUpHandler=this.upHandler.bind(this),this.boundMouseOutHandler=this.mouseOutHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),a.addEventListener("mousemove",this.boundMoveHandler),a.addEventListener("mouseup",this.boundUpHandler),a.addEventListener("mouseout",this.boundMouseOutHandler),this.controlModel&&this.render()};q.prototype.render=function(){window.requestAnimationFrame(this._renderBound)},q.prototype._render=function(){var a;this.ctx.fillStyle="rgb(20,20,20)",this.ctx.fillRect(0,0,this.tw,this.th),this.ctx.fillStyle="#80C5FF";for(var b=this.controlModel.getData(),c=0;c<b.length;c+=1)if(a=b[c]){var d=c*this.step,e=8,f=this.th-a/127*this.th,g=this.th-f;this.ctx.fillRect(d,f,e,g)}},q.prototype._calculate=function(a){var b=Math.floor(a.offsetX/this.step),c=Math.round((this.th-a.offsetY)/this.th*127);this.controlModel.setValue(b,c)},q.prototype.downHandler=function(a){this.down=!0,this._calculate(a),this.render()},q.prototype.upHandler=function(){this.down=!1},q.prototype.moveHandler=function(a){this.down&&(this._calculate(a),this.render())},q.prototype.mouseOutHandler=function(a){console.log("Mouse out"),this.upHandler(a)},q.prototype.setCurrent=function(a){this.controlModel.setCurrent(a),this.render()},q.prototype.resetCurrent=function(){this.controlModel.reset(),this.render()},q.prototype.setControlModel=function(a){this.controlModel=a,this.render()};var r=function(a,b){this.el=a,this.patternButtonCallback=b.patternButtonCallback,this.patterns=b.patterns,this._render(),this.boundDownHandlerDelegator=this._downHandlerDelegator.bind(this),a.addEventListener("mousedown",this.boundDownHandlerDelegator)};r.prototype.getPattern=function(a){return this.patterns[a]},r.prototype._downHandlerDelegator=function(a){if(a.target&&"BUTTON"==a.target.nodeName){var b=parseInt(a.target.classList[1].match(/\d+/g)[0]);this.patternButtonCallback(b)}},r.prototype._render=function(){for(var a="",b=0;b<this.patterns.length;b+=1)a+="<div class='pattern-item pattern-"+b+"'><span class='pattern-name'>"+this.patterns[b].name+"</span><span class='pattern-num'>"+this.patterns[b].channel+"</span><button class='edit edit-pattern-"+b+"''>Edit..</button></div>";this.el.innerHTML=a},r.prototype.removePattern=function(){},r.prototype.addPattern=function(){this.pattern.length+1};var s=function(a,b){this.data=[[]],this.el=a,this.ctx=a.getContext("2d"),this.patternN=b.patternN,this.songLen=b.songLen,this.patternH=23,this.patternW=90,this.timeTrackH=22,this.setDimensions(),this.inset=2,this._renderBound=this._render.bind(this),this.boundDownHandler=this.downHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),this.render()};s.prototype.erase=function(){this.data=[[]]},s.prototype.setSongLen=function(a){this.songLen=a,this.setDimensions(),this.render()},s.prototype.getSongLen=function(){return this.songLen},s.prototype.setPatternNumber=function(a){this.patternN=a},s.prototype.getPatternPosFromEvent=function(a){if(a.offsetY>=this.th-this.timeTrackH)return null;var b=Math.floor(a.offsetX/this.patternW),c=Math.floor(a.offsetY/this.patternH);return{pattern:c,position:b}},s.prototype.setDimensions=function(){this.tw=this.el.width=this.songLen*this.patternW,this.th=this.el.height=this.patternN*this.patternH+this.timeTrackH},s.prototype.setState=function(a,b,c){if(1===arguments.length){var d=arguments[0];return this.data=d.data,void(d.songLen!==this.songLen&&(this.songLen=d.songLen,this.setDimensions()))}"undefined"==typeof this.data[a]&&(this.data[a]=[]),this.data[a][b]=c},s.prototype.getState=function(a,b){return 0===arguments.length?{data:this.data,songLen:this.songLen}:"undefined"==typeof this.data[a]?void 0:this.data[a][b]},s.prototype.flipState=function(a,b){this.getState(a,b)?this.setState(a,b,void 0):this.setState(a,b,!0)},s.prototype.downHandler=function(a){var b=this.getPatternPosFromEvent(a);b&&(this.flipState(b.position,b.pattern),this.render())},s.prototype._render=function(){this.ctx.fillStyle="rgb(20,20,20)",this.ctx.fillRect(0,0,this.tw,this.th-this.timeTrackH),this.ctx.fillStyle="rgb(0,0,0)",this.ctx.fillRect(0,this.th-this.timeTrackH,this.tw,this.th),this.ctx.fillStyle="#80A500";for(var a=0;a<this.data.length;a+=1)if(!(a>this.songLen)&&this.data[a])for(var b=0;b<this.data[a].length;b+=1)if(!(b>this.patternN)&&this.getState(a,b)){var c=a*this.patternW,d=this.patternW-1,e=b*this.patternH,f=this.patternH-1;this.ctx.beginPath(),this.ctx.moveTo(c,e+this.inset),this.ctx.lineTo(c+this.inset,e),this.ctx.lineTo(c+d-this.inset,e),this.ctx.lineTo(c+d,e+this.inset),this.ctx.lineTo(c+d,e+f-this.inset),this.ctx.lineTo(c+d-this.inset,e+f),this.ctx.lineTo(c+this.inset,e+f),this.ctx.lineTo(c,e+f-this.inset),this.ctx.fill(),this.ctx.closePath()}this.ctx.strokeStyle="rgb(45, 45, 45)",this.ctx.fillStyle="rgb(200, 200, 200)",this.ctx.beginPath();for(var g=0,h=0;h<=this.tw;h+=this.patternW)this.ctx.moveTo(h,0),this.ctx.lineTo(h,this.th),this.ctx.font="12px 'Exo 2'",this.ctx.fillText(g,h+5,this.th-5),g+=2;this.ctx.stroke()},s.prototype.render=function(){window.requestAnimationFrame(this._renderBound)};var t=function(a,b){this.isPlaying=!1,this.playButton=a,this.midiHandler=b};t.prototype.getPlayingState=function(){return this.isPlaying},t.prototype.playSong=function(){console.log("Play Song"),this.isPlaying=!0},t.prototype.playPattern=function(a){console.log("Play Pattern"),this.isPlaying=!0;var b=a.getHash(),c=a.getOrdered();console.log(b,c)},t.prototype.stop=function(){console.log("Stop"),this.isPlaying=!1};var u=function(a){this.domEl=a.div,this.patternList=[],this.loop=!1,this.songLen=16,this.bpm=90,this.PATTERN_N=16,this.patternSequencerDiv=this.domEl.querySelector(".pattern-sequencer-main-div"),this.patternEditorDiv=this.domEl.querySelector(".pattern-editor-container"),this.backToSeqButton=this.domEl.querySelector(".back-to-seq"),this.patternMainLabel=this.domEl.querySelector(".pattern-main-label"),this.resetButton=this.domEl.querySelector(".reset-button"),this.controlSelector=this.domEl.querySelector(".control-selector"),this.toggleButton=this.domEl.querySelector(".toggle-loop"),this.songLengthElement=this.domEl.querySelector(".song-length"),this.bpmElement=this.domEl.querySelector(".bpm"),this.playSongElement=this.domEl.querySelector(".play-button-song"),this.playPatternElement=this.domEl.querySelector(".play-button-pattern"),this.songScheduler=new t({el:this.playSongElement}),this.patternScheduler=new t({el:this.playPatternElement}),this.playSongElement.addEventListener("click",function(){this.songScheduler.getPlayingState()?(this.playSongElement.innerHTML="Play &#9654;",this.songScheduler.stop()):(this.playSongElement.innerHTML="Stop &#9724;",this.songScheduler.playSong())}.bind(this)),this.playPatternElement.addEventListener("click",function(){if(this.patternScheduler.getPlayingState())this.playPatternElement.innerHTML="Play &#9654;",this.patternScheduler.stop();else{this.playPatternElement.innerHTML="Stop &#9724;";var a=this.rollView.getStrip();this.patternScheduler.playPattern(a)}}.bind(this)),t.prototype.setButtonView=function(a){"play"!==a||this.isPlaying||(this.playButton.el.innerHTML=this.playButton.stopText,this.isPlaying=!0),"stop"===a&&this.isPlaying&&(this.playButton.el.innerHTML=this.playButton.playText,this.isPlaying=!1)},t.prototype.toggleButtonView=function(){this.setButtonView(this.isPlaying?"stop":"play")},this.songLengthElement.addEventListener("change",function(a){var b=parseInt(a.target.value,10);b?(this.songLen=b,this.changeSongLength()):this.changeSongLength({onlyChangeView:!0})}.bind(this)),this.changeSongLength=function(a){return a&&a.syncView?void(this.songLengthElement.value=this.ps.getSongLen()):void(this.ps.getSongLen()!==this.songLen&&(a&&a.onlyChangeView||this.ps.setSongLen(this.songLen),this.songLengthElement.value=this.songLen))},this.bpmElement.addEventListener("change",function(a){var b=parseInt(a.target.value,10);b&&b>=10&&180>=b?this.bpm=b:this.changeBpm()}.bind(this)),this.changeBpm=function(){this.bpmElement.value=this.bpm},this.toggleButton.addEventListener("click",function(){this.loop=this.loop?!1:!0,this.changeLoopToggle()}.bind(this)),this.changeLoopToggle=function(){this.loop?this.toggleButton.classList.add("down"):this.toggleButton.classList.remove("down")},this.backToSeqButton.addEventListener("click",function(){this.patternSequencerDiv.classList.remove("hidden"),this.patternEditorDiv.classList.add("hidden")}.bind(this)),this.resetButton.addEventListener("click",function(){this.controlView.resetCurrent()}.bind(this)),this.controlSelector.addEventListener("change",function(a){this.controlView.setCurrent(a.target.value)}.bind(this)),this.psElement=this.domEl.querySelector(".pattern-sequencer"),this.ps=new s(this.psElement,{songLen:this.songLen,patternN:16}),this.changeSongLength();for(var b=0;b<this.PATTERN_N;b+=1)this.patternList.push({name:"Pattern "+(b+1),channel:1,strip:new j,controls:new p});this.setState=function(a){this.loop=a.loop,this.bpm=a.bpm,this.ps.setState(a.sequencer);for(var b=0;b<this.PATTERN_N;b+=1)this.patternList[b].strip.setHash(a.patternList[b].strip),this.patternList[b].controls.setState(a.patternList[b].controls)},a.initialState&&a.initialState.data&&this.setState(a.initialState.data),this.changeSongLength({syncView:!0}),this.changeBpm(),this.changeLoopToggle(),this.patternListElement=this.domEl.querySelector(".pattern-list"),this.pv=new r(this.patternListElement,{patternButtonCallback:function(a){var b=this.pv.getPattern(a);this.rollView.setStrip(b.strip),this.controlView.setControlModel(b.controls),this.controlSelector.value=b.controls.getCurrent(),this.patternMainLabel.innerHTML=b.name,this.patternSequencerDiv.classList.add("hidden"),this.patternEditorDiv.classList.remove("hidden")}.bind(this),patterns:this.patternList}),this.sheet=this.domEl.querySelector(".sheet"),this.snapMenu=this.domEl.querySelector(".snap"),this.durationMenu=this.domEl.querySelector(".newnote"),this.piano=this.domEl.querySelector(".piano"),this.controls=this.domEl.querySelector(".controls"),this.rollView=new n(this.sheet),this.snapMenu.addEventListener("change",function(a){this.rollView.setStep(parseFloat(a.target.value,10)),this.rollView.render()}.bind(this)),this.durationMenu.addEventListener("change",function(a){this.rollView.setDefaultDuration(parseFloat(a.target.value,10))}.bind(this)),this.pianoView=new o(this.piano,2,5),this.controlView=new q(this.controls),this.getState=function(){for(var a={sequencer:this.ps.getState(),patternList:[],bpm:this.bpm,loop:this.loop},b=0;b<this.PATTERN_N;b+=1)a.patternList[b]={},a.patternList[b].strip=this.patternList[b].strip.getHash(),a.patternList[b].controls=this.patternList[b].controls.getState();return a};var c=function(){return{data:this.getState()}};a.hostInterface.setSaveState(c.bind(this)),a.hostInterface.setInstanceStatus("ready")};return{initPlugin:u,pluginConf:e}});