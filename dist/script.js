define(["require","github:pieroxy/lz-string@master/libs/lz-string-1.3.3-min","./index.html!text","./style.css!text","#google Exo 2:300 !font"],function(a,b,c,d){var e={name:"Hya Sequencer",version:"0.0.1",hyaId:"HSEQ",ui:{type:"div",width:600,height:460,html:c,css:d}},f=function(a,b){var c,d,e=parseInt(document.defaultView.getComputedStyle(b,null).paddingLeft,10)||0,f=parseInt(document.defaultView.getComputedStyle(b,null).paddingTop,10)||0,g=parseInt(document.defaultView.getComputedStyle(b,null).borderLeftWidth,10)||0,h=parseInt(document.defaultView.getComputedStyle(b,null).borderTopWidth,10)||0,i=document.body.parentNode,j=i.offsetTop,k=i.offsetLeft,l=b,m=0,n=0;if("undefined"!=typeof l.offsetParent)do m+=l.offsetLeft,n+=l.offsetTop;while(l=l.offsetParent);m+=e+g+k,n+=f+h+j,c=a.pageX-m,d=a.pageY-n;var o=parseInt(document.defaultView.getComputedStyle(b,null).getPropertyValue("width"),10)||0,p=parseInt(document.defaultView.getComputedStyle(b,null).getPropertyValue("height"),10)||0,q=b.getAttribute("width"),r=b.getAttribute("height"),s=q/o,t=r/p;return c*=s,d*=t,{x:c,y:d}},g=function(a,b,c,d){return{start:a,duration:b,number:c,id:d}},h=function(){this.notesHash={},this.notesArray=[],this.idCounter=0};h.prototype.uniqueId=function(){return++this.idCounter+""},h.prototype.syncSort=function(){var a=[];for(var b in this.notesHash)a.push(this.notesHash[b]);a.sort(function(a,b){return a.start-b.start}),this.notesArray=a},h.prototype.addNote=function(a,b,c){var d=this.uniqueId();return this.notesHash[d]=g(a,b,c,d),this.syncSort(),d},h.prototype.getNote=function(a){return this.notesHash[a]},h.prototype.removeNote=function(a){delete this.notesHash[a],this.syncSort()},h.prototype.resizeNote=function(a,b){this.notesHash[a].duration=b},h.prototype.moveNote=function(a,b,c){null!==b&&(this.notesHash[a].start=b,this.syncSort()),null!==c&&(this.notesHash[a].number=c)},h.prototype.getOrdered=function(){return this.notesArray},h.prototype.getHash=function(){return this.notesHash},h.prototype.setHash=function(a){this.notesHash=a,this.syncSort();var b=-1;for(var c in this.notesHash){var d=this.notesHash[c].id;d>b&&(b=d),this.idCounter=b+1}},h.prototype.getNoteAtPosition=function(a,b){for(var c in this.notesHash){var d=this.notesHash[c];if(d.number===b&&d.start<a&&d.start+d.duration>a)return d}};var i=1,j=.5,k=.25,l=function(a,b){this.name="",this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.down=!1,this.step=j,this.defaultDuration=i,this.delta=null,this.resizing=!1,this.moving=!1,this._renderBound=this._render.bind(this),this.channel=1,this.strip=b,this.noteHeight=Math.round(this.th/60),this.noteWidth=this.tw/8,this.boundDownHandler=this.downHandler.bind(this),this.boundMoveHandler=this.moveHandler.bind(this),this.boundUpHandler=this.upHandler.bind(this),this.boundDblHandler=this.dblHandler.bind(this),this.boundMouseOutHandler=this.mouseOutHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),a.addEventListener("mousemove",this.boundMoveHandler),a.addEventListener("mouseup",this.boundUpHandler),a.addEventListener("dblclick",this.boundDblHandler),a.addEventListener("mouseout",this.boundMouseOutHandler),this.strip&&this.render()};l.prototype.setChannel=function(a){this.channel=a},l.prototype.getChannel=function(){return this.channel},l.prototype.setStrip=function(a){this.strip=a,this.render()},l.prototype.getStrip=function(){return this.strip},l.prototype.setStep=function(a){this.step=a},l.prototype.setDefaultDuration=function(a){this.defaultDuration=a},l.prototype._renderGrid=function(){var a=this.noteWidth*this.step;if(this.ctx.beginPath(),this.step)for(var b=0;b<=this.tw;b+=a)this.ctx.moveTo(b,0),this.ctx.lineTo(b,this.th);for(var c=0;c<=this.th;c+=this.noteHeight)this.ctx.moveTo(0,c),this.ctx.lineTo(this.tw,c);this.ctx.strokeStyle="rgba(255, 255, 255, 0.1)",this.ctx.stroke()},l.prototype._render=function(){var a=null,b=this.strip.getHash();this.ctx.fillStyle="rgb(30,30,30)",this.ctx.fillRect(0,0,this.tw,this.th),this._renderGrid();for(var c in b){var d=b[c],e=d.start*this.noteWidth,f=d.duration*this.noteWidth-1,g=this.th-d.number*this.noteHeight,h=this.noteHeight-1;this.selected&&d.id===this.selected?a={left:e,top:g,width:f,height:h}:(this.ctx.fillStyle="#FFC500",this.ctx.fillRect(e,g,f,h))}a&&(this.ctx.fillStyle="OrangeRed",this.ctx.fillRect(a.left,a.top,a.width,a.height))},l.prototype.render=function(){window.requestAnimationFrame(this._renderBound)},l.prototype.getPosFromEvent=function(a){var b=(f(a,this.el),a.offsetX/this.noteWidth),c=Math.ceil((this.th-a.offsetY)/this.noteHeight);return{start:b,number:c}},l.prototype.getNoteFromEvent=function(a){var b=this.getPosFromEvent(a);return this.strip.getNoteAtPosition(b.start,b.number)},l.prototype.downHandler=function(a){var b=!1,c=this.getNoteFromEvent(a);c?(this.selected=c.id,this.down=!0,b=!0):this.selected&&(this.selected=void 0,b=!0),b&&this.render()},l.prototype.moveHandler=function(a){{var b=!1;this.getNoteFromEvent(a)}if(this.down&&this.selected){console.log("bring the action!");var c=this.getPosFromEvent(a),d=this.strip.getNote(this.selected),e=c.start-d.start;if(!this.moving&&(this.resizing||e>.8*d.duration)){this.resizing=!0;var f=e;this.step&&(f=Math.round(f/this.step)*this.step),f<this.step&&(f=d.duration,b=!1),k/2>f&&(f=k/2),this.strip.resizeNote(this.selected,f),b=!0}else{this.moving=!0;var g={start:d.start,number:d.number};null===this.delta&&(this.delta=e),g.start=c.start-this.delta,this.step?(g.start=Math.round(g.start/this.step)*this.step,g.start!==d.start&&(b=!0)):b=!0,c.note!==d.number&&(g.number=c.number,b=!0),b&&this.strip.moveNote(this.selected,g.start,g.number)}}b&&this.render()},l.prototype.upHandler=function(a){var b=!1;this.down=!1,this.delta=null,this.resizing=!1,this.moving=!1;this.getNoteFromEvent(a);b&&this.render()},l.prototype.dblHandler=function(a){if(this.selected)this.strip.removeNote(this.selected),this.selected=void 0,this.render();else{var b=this.getPosFromEvent(a);this.step&&(b.start=Math.floor(b.start/this.step)*this.step),this.strip.addNote(b.start,this.defaultDuration,b.number),this.render()}},l.prototype.mouseOutHandler=function(a){console.log("Mouse out"),this.upHandler(a)},l.prototype.getState=function(){return{channel:this.channel,strip:this.strip,step:this.step,noteDur:this.defaultDuration}};var m=function(a,b,c){this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.minOct=b,this.octaves=c;for(var d=["B","A#","A","G#","G","F#","F","E","D#","D","C#","C"],e=12*c,f=0;e>f;f+=1){var g=d[f%12],h=b+(c-Math.floor(f/12))-1,i="#"===g.charAt(1);this.ctx.fillStyle=i?"black":"white";var j=this.tw,k=this.th/e,l=f*k,m=0;this.ctx.fillRect(m,l,j,k-1),this.ctx.fillStyle=i?"white":"black";var n=g+" "+h;this.ctx.font="12px 'Exo 2'",this.ctx.fillText(n,20,l+18)}},n=function(){this.controlData={cc21:[]},this.current="cc21"};n.prototype.getState=function(){return{controlData:this.controlData,current:this.current}},n.prototype.setState=function(a){this.controlData=a.controlData,this.current=a.current},n.prototype.getData=function(){return this.controlData[this.current]},n.prototype.setData=function(a){this.controlData[this.current]=a},n.prototype.getValue=function(a){return this.controlData[this.current][a]},n.prototype.setValue=function(a,b){this.controlData[this.current][a]=b},n.prototype.reset=function(){this.controlData[this.current]=[]},n.prototype.setCurrent=function(a){this.current=a,this.controlData[a]||(this.controlData[a]=[])},n.prototype.getCurrent=function(){return this.current};var o=function(a){this.el=a,this.tw=a.width,this.th=a.height,this.ctx=a.getContext("2d"),this.down=!1,this.controlModel=null,this.step=this.tw/32,this._renderBound=this._render.bind(this),this.boundDownHandler=this.downHandler.bind(this),this.boundMoveHandler=this.moveHandler.bind(this),this.boundUpHandler=this.upHandler.bind(this),this.boundMouseOutHandler=this.mouseOutHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),a.addEventListener("mousemove",this.boundMoveHandler),a.addEventListener("mouseup",this.boundUpHandler),a.addEventListener("mouseout",this.boundMouseOutHandler),this.controlModel&&this.render()};o.prototype.render=function(){window.requestAnimationFrame(this._renderBound)},o.prototype._render=function(){var a;this.ctx.fillStyle="rgb(20,20,20)",this.ctx.fillRect(0,0,this.tw,this.th),this.ctx.fillStyle="#80C5FF";for(var b=this.controlModel.getData(),c=0;c<b.length;c+=1)if(a=b[c]){var d=c*this.step,e=8,f=this.th-a/127*this.th,g=this.th-f;this.ctx.fillRect(d,f,e,g)}},o.prototype._calculate=function(a){var b=Math.floor(a.offsetX/this.step),c=Math.round((this.th-a.offsetY)/this.th*127);this.controlModel.setValue(b,c)},o.prototype.downHandler=function(a){this.down=!0,this._calculate(a),this.render()},o.prototype.upHandler=function(){this.down=!1},o.prototype.moveHandler=function(a){this.down&&(this._calculate(a),this.render())},o.prototype.mouseOutHandler=function(a){console.log("Mouse out"),this.upHandler(a)},o.prototype.setCurrent=function(a){this.controlModel.setCurrent(a),this.render()},o.prototype.resetCurrent=function(){this.controlModel.reset(),this.render()},o.prototype.setControlModel=function(a){this.controlModel=a,this.render()};var p=function(a,b){this.el=a,this.patternButtonCallback=b.patternButtonCallback,this.patterns=b.patterns,this.render(),this.boundDownHandlerDelegator=this._downHandlerDelegator.bind(this),a.addEventListener("mousedown",this.boundDownHandlerDelegator)};p.prototype.getPattern=function(a){return this.patterns[a]},p.prototype._downHandlerDelegator=function(a){if(a.target&&"BUTTON"==a.target.nodeName){var b=parseInt(a.target.classList[1].match(/\d+/g)[0]);this.patternButtonCallback(b)}},p.prototype.render=function(){for(var a="",b=0;b<this.patterns.length;b+=1)a+="<div class='pattern-item pattern-"+b+"'><span class='pattern-name'>"+this.patterns[b].name+"</span><span class='pattern-num'>"+this.patterns[b].channel+"</span><button class='edit edit-pattern-"+b+"''>Edit..</button></div>";this.el.innerHTML=a},p.prototype.removePattern=function(){},p.prototype.addPattern=function(){this.pattern.length+1};var q=function(a,b){this.data=[[]],this.el=a,this.ctx=a.getContext("2d"),this.patternN=b.patternN,this.songLen=b.songLen,this.patternH=23,this.patternW=90,this.timeTrackH=22,this.setDimensions(),this.inset=2,this._renderBound=this._render.bind(this),this.boundDownHandler=this.downHandler.bind(this),a.addEventListener("mousedown",this.boundDownHandler),this.render()};q.prototype.erase=function(){this.data=[[]]},q.prototype.setSongLen=function(a){this.songLen=a,this.setDimensions(),this.render()},q.prototype.getSongLen=function(){return this.songLen},q.prototype.setPatternNumber=function(a){this.patternN=a},q.prototype.getPatternPosFromEvent=function(a){if(a.offsetY>=this.th-this.timeTrackH)return null;var b=Math.floor(a.offsetX/this.patternW),c=Math.floor(a.offsetY/this.patternH);return{pattern:c,position:b}},q.prototype.setDimensions=function(){this.tw=this.el.width=this.songLen*this.patternW,this.th=this.el.height=this.patternN*this.patternH+this.timeTrackH},q.prototype.setState=function(a,b,c){if(1===arguments.length){var d=arguments[0];return this.data=d.data,void(d.songLen!==this.songLen&&(this.songLen=d.songLen,this.setDimensions()))}"undefined"==typeof this.data[a]&&(this.data[a]=[]),this.data[a][b]=c},q.prototype.getState=function(a,b){return 0===arguments.length?{data:this.data,songLen:this.songLen}:"undefined"==typeof this.data[a]?void 0:this.data[a][b]},q.prototype.flipState=function(a,b){this.getState(a,b)?this.setState(a,b,void 0):this.setState(a,b,!0)},q.prototype.downHandler=function(a){var b=this.getPatternPosFromEvent(a);b&&(this.flipState(b.position,b.pattern),this.render())},q.prototype._render=function(){this.ctx.fillStyle="rgb(20,20,20)",this.ctx.fillRect(0,0,this.tw,this.th-this.timeTrackH),this.ctx.fillStyle="rgb(0,0,0)",this.ctx.fillRect(0,this.th-this.timeTrackH,this.tw,this.th),this.ctx.fillStyle="#80A500";for(var a=0;a<this.data.length;a+=1)if(!(a>this.songLen)&&this.data[a])for(var b=0;b<this.data[a].length;b+=1)if(!(b>this.patternN)&&this.getState(a,b)){var c=a*this.patternW,d=this.patternW-1,e=b*this.patternH,f=this.patternH-1;this.ctx.beginPath(),this.ctx.moveTo(c,e+this.inset),this.ctx.lineTo(c+this.inset,e),this.ctx.lineTo(c+d-this.inset,e),this.ctx.lineTo(c+d,e+this.inset),this.ctx.lineTo(c+d,e+f-this.inset),this.ctx.lineTo(c+d-this.inset,e+f),this.ctx.lineTo(c+this.inset,e+f),this.ctx.lineTo(c,e+f-this.inset),this.ctx.fill(),this.ctx.closePath()}this.ctx.strokeStyle="rgb(45, 45, 45)",this.ctx.fillStyle="rgb(200, 200, 200)",this.ctx.beginPath();for(var g=0,h=0;h<=this.tw;h+=this.patternW)this.ctx.moveTo(h,0),this.ctx.lineTo(h,this.th),this.ctx.font="12px 'Exo 2'",this.ctx.fillText(g,h+5,this.th-5),g+=2;this.ctx.stroke()},q.prototype.render=function(){window.requestAnimationFrame(this._renderBound)};var r,s=.4,t=function(a,b,c){this.midiHandler=b,this.context=c,r=this};t.prototype.clearTimeouts=function(){this.stopped=!0,clearTimeout(this.endTimeout)},t.prototype.playSong=function(a,b,c,d,e,f){console.log("Play Song");var g=60/d*8,h=0,i=!1,j=function(){if(console.log("Scheduling for",h),this.stopped)return this.stopped=!1,i=!0,void console.log("Wait state");if(h===a.songLen)return console.log("Finished by itself"),void c();for(var b=s+this.context.currentTime,k=0;k<a.data[h].length;k+=1)r.playPattern(f.getPattern(k).strip,f.getPattern(k).controls.controlData,null,d,e[k].channel,b);h+=1,console.log("reScheduling in",g),this.scheduleTimeout=setTimeout(j,1e3*g)}.bind(this);if(j(),"function"==typeof c){var g=60/d*8;this.endTimeout=setTimeout(c,g*a.songLen*1e3)}},t.prototype.playPattern=function(a,b,c,d,e,f){console.log("Play Pattern"),this.isPlaying=!0;var g=a.getOrdered(),h=f;f||(h=this.context.currentTime+s);var i=60/d;for(var j in g){var k=g[j],l={type:"noteon",channel:e,pitch:k.number+24,velocity:127},m={type:"noteoff",channel:e,pitch:k.number+24,velocity:127},n=h+k.start*i,o=n+k.duration*i;this.midiHandler.sendMIDIMessage(l,n),this.midiHandler.sendMIDIMessage(m,o)}for(var p=0;32>p;p+=1){var q=[];for(var r in b)if(0===r.indexOf("cc")){var t=parseInt(r.substr(2,4),10),u=b[r][p];"undefined"!=typeof u&&q.push({type:"controlchange",channel:e,control:t,value:u})}var v=i/4*p+h;q.length&&this.midiHandler.sendMIDIMessage(q,v)}"function"==typeof c&&setTimeout(c,8*i*1e3)},t.prototype.stop=function(a){this.clearTimeouts(),a()};var u=function(a){this.context=a.audioContext,this.midiHandler=a.MIDIHandler,this.domEl=a.div,this.patternList=[],this.loop=!1,this.songLen=16,this.bpm=90,this.playing=!1,this.PATTERN_N=16,this.patternSequencerDiv=this.domEl.querySelector(".pattern-sequencer-main-div"),this.patternEditorDiv=this.domEl.querySelector(".pattern-editor-container"),this.backToSeqButton=this.domEl.querySelector(".back-to-seq"),this.patternMainLabel=this.domEl.querySelector(".pattern-main-label"),this.resetButton=this.domEl.querySelector(".reset-button"),this.controlSelector=this.domEl.querySelector(".control-selector"),this.toggleButton=this.domEl.querySelector(".toggle-loop"),this.songLengthElement=this.domEl.querySelector(".song-length"),this.bpmElement=this.domEl.querySelector(".bpm"),this.playSongElement=this.domEl.querySelector(".play-button-song"),this.playPatternElement=this.domEl.querySelector(".play-button-pattern"),this.channelElement=this.domEl.querySelector(".channel"),this.channelElement.addEventListener("change",function(a){this.patternList[this.currentPattern].channel=a.target.value}.bind(this)),this.songScheduler=new t({el:this.playSongElement},this.midiHandler,this.context),this.patternScheduler=new t({el:this.playPatternElement},this.midiHandler,this.context),this.playSongElement.addEventListener("click",function(){this.playing?(this.playing=!1,this.playSongElement.innerHTML="Wait",this.songScheduler.stop(function(){this.playSongElement.innerHTML="Play &#9654;"}.bind(this))):(this.playing=!0,this.playSongElement.innerHTML="Stop &#9724;",this.songScheduler.playSong(this.ps.getState(),this.loop,function(){this.playing&&(this.playing=!1,this.playSongElement.innerHTML="Play &#9654;")}.bind(this),this.bpm,this.patternList,this.pv))}.bind(this)),this.playPatternElement.addEventListener("click",function(){this.playPatternElement.innerHTML="Queue";var a=this.rollView.getStrip();this.patternScheduler.playPattern(a,this.patternList[this.currentPattern].controls.getState().controlData,function(){this.playPatternElement.innerHTML="Play &#9654;",this.patternScheduler.stop()}.bind(this),this.bpm,this.patternList[this.currentPattern].channel)}.bind(this)),this.songLengthElement.addEventListener("change",function(a){var b=parseInt(a.target.value,10);b?(this.songLen=b,this.changeSongLength()):this.changeSongLength({onlyChangeView:!0})}.bind(this)),this.changeSongLength=function(a){return a&&a.syncView?void(this.songLengthElement.value=this.ps.getSongLen()):void(this.ps.getSongLen()!==this.songLen&&(a&&a.onlyChangeView||this.ps.setSongLen(this.songLen),this.songLengthElement.value=this.songLen))},this.bpmElement.addEventListener("change",function(a){var b=parseInt(a.target.value,10);b&&b>=10&&180>=b?this.bpm=b:this.changeBpm()}.bind(this)),this.changeBpm=function(){this.bpmElement.value=this.bpm},this.toggleButton.addEventListener("click",function(){this.loop=this.loop?!1:!0,this.changeLoopToggle()}.bind(this)),this.changeLoopToggle=function(){this.loop?this.toggleButton.classList.add("down"):this.toggleButton.classList.remove("down")},this.backToSeqButton.addEventListener("click",function(){this.currentPattern=null,this.patternSequencerDiv.classList.remove("hidden"),this.patternEditorDiv.classList.add("hidden"),this.pv.render()}.bind(this)),this.resetButton.addEventListener("click",function(){this.controlView.resetCurrent()}.bind(this)),this.controlSelector.addEventListener("change",function(a){this.controlView.setCurrent(a.target.value)}.bind(this)),this.psElement=this.domEl.querySelector(".pattern-sequencer"),this.ps=new q(this.psElement,{songLen:this.songLen,patternN:16}),this.changeSongLength();for(var b=0;b<this.PATTERN_N;b+=1)this.patternList.push({name:"Pattern "+(b+1),channel:1,strip:new h,controls:new n});this.setState=function(a){this.loop=a.loop,this.bpm=a.bpm,this.ps.setState(a.sequencer);for(var b=0;b<this.PATTERN_N;b+=1)this.patternList[b].strip.setHash(a.patternList[b].strip),this.patternList[b].controls.setState(a.patternList[b].controls),this.patternList[b].channel=a.patternList[b].channel},a.initialState&&a.initialState.data&&this.setState(a.initialState.data),this.changeSongLength({syncView:!0}),this.changeBpm(),this.changeLoopToggle(),this.patternListElement=this.domEl.querySelector(".pattern-list"),this.pv=new p(this.patternListElement,{patternButtonCallback:function(a){var b=this.pv.getPattern(a);this.rollView.setStrip(b.strip),this.controlView.setControlModel(b.controls),this.controlSelector.value=b.controls.getCurrent(),this.patternMainLabel.innerHTML=b.name,this.patternSequencerDiv.classList.add("hidden"),this.patternEditorDiv.classList.remove("hidden"),this.channelElement.value=this.patternList[a].channel,this.currentPattern=a}.bind(this),patterns:this.patternList}),this.sheet=this.domEl.querySelector(".sheet"),this.snapMenu=this.domEl.querySelector(".snap"),this.durationMenu=this.domEl.querySelector(".newnote"),this.piano=this.domEl.querySelector(".piano"),this.controls=this.domEl.querySelector(".controls"),this.rollView=new l(this.sheet),this.snapMenu.addEventListener("change",function(a){this.rollView.setStep(parseFloat(a.target.value,10)),this.rollView.render()}.bind(this)),this.durationMenu.addEventListener("change",function(a){this.rollView.setDefaultDuration(parseFloat(a.target.value,10))}.bind(this)),this.pianoView=new m(this.piano,2,5),this.controlView=new o(this.controls),this.getState=function(){for(var a={sequencer:this.ps.getState(),patternList:[],bpm:this.bpm,loop:this.loop},b=0;b<this.PATTERN_N;b+=1)a.patternList[b]={},a.patternList[b].strip=this.patternList[b].strip.getHash(),a.patternList[b].controls=this.patternList[b].controls.getState(),a.patternList[b].channel=this.patternList[b].channel;return a};var c=function(){return{data:this.getState()}};a.hostInterface.setSaveState(c.bind(this)),a.hostInterface.setInstanceStatus("ready")};return{initPlugin:u,pluginConf:e}});