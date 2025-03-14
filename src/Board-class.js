import React, { Component } from "react";
import Slot from "./Slot";
import SlotForm from "./SlotForm";
import ConfigLoader from "./ConfigLoader";
import ShareConfigBox from "./ShareConfigBox";
import Menu from "./Menu";
import editButton from "./edit.svg";
import menuButton from "./menu.svg";
import saveButton from "./save.svg";
import shareButton from "./share.svg";
import addButton from "./add.svg";
import loadButton from "./square.grid.2x2.svg";
import pauseButton from "./pause.svg";


class Board extends Component {
    static TK_nameprefix = "TK_";
    static defaultSlotsConfig = '{"label":"New TimeKeeper","slots":[{ "label": "Partie 1", "duration": 3 }, { "label": "Partie 2", "duration": 15 }]}';
    state = {slotsStates: []};
    constructor(props) {
        super(props);
        this.state = {
            slotsStates: [],
            test: 'init',
            displayShareBox : false,
            displayConfigBox : false
        };
        //console.log('Construct...', this);
       
        var initSlots;
        if (props.slots && props.slots != null) {
            initSlots = this.loadSlotsConfig( props.slots )
        }
        else if (props.slotsName) {
            initSlots = this.loadSlotsConfig( this.loadStorage( props.slotsName ) );
        }
        else
            initSlots = this.loadSlotsConfig( Board.defaultSlotsConfig )

        this.state.slots = initSlots[0];
        this.state.slotsStates = initSlots[1];
        this.state.name = initSlots[2];
        this.state.label = initSlots[3];
        //this.currentRunningSlot = this.state.slots[0] || null;
        this.state.currentRunningSlotIndex = 0;
        this.state.currentrunningState = "stop";
        this.boardControler = {
                start: this.start.bind(this),
                pause: this.pause.bind(this),
                next: this.next.bind(this),
                editSlot: this.editSlot.bind(this),
                deleteSlot: this.deleteSlot.bind(this)
            }
        this.state.slotForm =  <SlotForm duration="60" label="New" board={this}/>;
    }
    loadSlotsConfig(slotsStr){
        //console.log("getSlots")
        let slotsConf = JSON.parse( slotsStr );
        var slots = [];
        var slotsStates = [];
        slotsConf.slots.forEach((sProps, k) => {
            //this.slots.push(<Slot label={sProps.label} duration={sProps.duration} key={k} currentState={this.state.slotsStates[k]} currentTest={this.state.test}/>);
            sProps.timeLeft = sProps.duration * 1000;
            slots.push(sProps);
            slotsStates.push('pending');
        });
        //console.log("getSlots", slots, slotsStates)
        return [slots, slotsStates, slotsConf.name, slotsConf.label];
    }
    updateConfig( name ){
        let configStr = this.loadStorage( name );
        //this.updateSlots( config );
        let config = this.loadSlotsConfig(configStr);
        this.setState( state => {
            state.slots = config[0];
            state.slotsStates = config[1];
            state.name = config[2];
            state.label = config[3];
            state.modeConfigLoader = false;
            return state;
        });
    }

    loadStorage( name ){
        //console.log("Board load : ", name)
        return  localStorage.getItem( Board.TK_nameprefix + name );
        //this.loadSlotsConfig( slotsStr );

    }
    shareCurrentConfig(){
        let url = document.location.href.replace(document.location.search,"") + "?b=" + btoa(JSON.stringify({label:this.state.label,slots:this.state.slots}));
        this.setState( state =>{ 
                state.displayShareBox = true;
                state.shareURL = url;
                return state});
    }
    closeShareBox(){
        this.setState( state =>{ 
            state.displayShareBox = false; 
            return state});
    }
    openConfigBox(){
        //console.log('closeConfigBox...')
        this.setState( state =>{ 
            state.displayConfigBox = true; 
            return state});
    }
    closeConfigBox(){
        //console.log('closeConfigBox...')
        this.setState( state =>{ 
            state.displayConfigBox = false; 
            return state});
    }
    start() {
        //let start = new Date();
        //console.log( this.state.slots.length , this.state.currentRunningSlotIndex, this.state.length > this.state.currentRunningSlotIndex);
        if (this.state.slots.length >= this.state.currentRunningSlotIndex) {

            //var end = new Date();
            //end.setSeconds( end.getSeconds() + this.currentRunningSlot.props.duration);
            //this.currentTimeout = setTimeout(this.next.bind(this), this.currentRunningSlot.duration * 1000);
            //this.currentRunningSlot.start();
            //let index = this.state.slots.indexOf(this.currentRunningSlot);
            let index = this.state.currentRunningSlotIndex;
            this.setState(state => {
                state.currentrunningState = "play";
                var slotsStates = state.slotsStates;
                state.slots[index].lastRefresh = new Date();
                slotsStates[index] = "running";
                return state;
            });

            this.currentInterval = setInterval(() => { this.decreaseTimer(); }, 10);


        }
        //console.log(this);
    }
    decreaseTimer() {
        //console.log( "DECREAAAAASE", this.currentRunningSlot, this.state.slots )
        var currentRunningSlot = this.state.slots[this.state.currentRunningSlotIndex];
        //console.log( "DecreaseTimer",this.state.currentRunningSlotIndex, currentRunningSlot )
        var diff = new Date() - currentRunningSlot.lastRefresh;
        //console.log("diff ? " , diff)
        var timeLeft = this.state.slots[this.state.currentRunningSlotIndex].timeLeft - diff
        if (diff < currentRunningSlot.timeLeft) {
            this.setState(state => {
                state.slots[state.currentRunningSlotIndex].lastRefresh = new Date();
                state.slots[state.currentRunningSlotIndex].timeLeft = timeLeft;
                return state;
            });
        } else {
            clearInterval(this.currentInterval);
            this.next();
        }

    }
    deleteSlot(index){
        //console.log('Deleting :', index);
        this.setState( state => {
            //console.log('Deleting State:', index);
            if(index !== null)
                state.slots.splice(index,1);
            index = null; //Slot have been delete but setState rerun to test state object, so deleting index
            return Object.assign({}, state);
           })
    }
    pause() {
        this.setState(state => {
            state.currentrunningState = "paused";
            return state;
        });
        clearInterval(this.currentInterval);
    }
    next() {
        //let index = this.state.slots.indexOf(this.currentRunningSlot);

        let index = this.state.currentRunningSlotIndex;
        this.setState(state => {
            state.slotsStates[index] = "finished";
            state.slots[index].timeLeft = 0;
            return state;
        });

        if (index < this.state.slots.length - 1) {
            let newIndex = this.state.currentRunningSlotIndex + 1;
            this.setState((state) => {
                state.currentRunningSlotIndex = newIndex;
                return state;
            }, this.start.bind(this));
            (new RingAlert()).ding();
        }
        else
            {
            (new RingAlert()).gong();

            }
    }
    resetSlotTimer(slot){
        let index = slot.props.index;
        this.setState(state => {
            state.slots[index].lastRefresh = new Date();
            state.slots[index].timeLeft = state.slots[state.currentRunningSlotIndex].duration * 1000;
            return state;
        });

    }
    validateSlotForm( slotForm ){
        //console.log(slotForm.props.index)
        if(typeof slotForm.props.index != "undefined")
        {
            /*this.state.slots[ slotForm.props.index ].label = slotForm.state.label;
            this.state.slots[ slotForm.props.index ].duration = slotForm.state.duration;
            */
           this.setState( state => {
            //console.log("CHANGE : ",slotForm)
            let i = parseInt(slotForm.props.index);
            state.slots[ i ].label = slotForm.state.label;
            state.slots[ i ].duration = slotForm.getDurationFromLabel();
            state.slots[ i ].timeLeft = slotForm.getDurationFromLabel()*1000;
            return Object.assign({}, state);
           })
        }
        else
        {
            //console.log("BOARD validate slot :", slotForm, slotForm.getDurationFromLabel() )
            this.setState( state => {
                state.slotsStates = state.slotsStates.concat(['pending']);
                let timeLeft = slotForm.getDurationFromLabel() * 1000;
                let {label, duration} = slotForm.state;
                //state.slots.push({ timeLeft, duration, label});
                state.slots = state.slots.concat([{ timeLeft, duration, label}]);
                return Object.assign({}, state);
            })
        }
    }
    toggleEditor(){
        this.setState( state => {
            state.modeEditor = !state.modeEditor;
            return Object.assign({}, state);
        })
    }
    toggleLoader(){
        this.setState( state => {
            state.modeConfigLoader = !state.modeConfigLoader;
            return Object.assign({}, state);
        })
    }
    toggleMenu(){
        this.setState( state => {
            state.displayMenu = !state.displayMenu;
            return Object.assign({}, state);
        })
    }
    
    editSlot(index){
        //console.log("Edit Slot", index)
        let slot = this.state.slots[ index ];
        this.state.slots.forEach( (el) => {el.editMode = el === slot;})
        //this.slotForm =  <SlotForm duration={slot.duration} label={slot.label} board={this} index={index}/>;
        this.setState((state)=>{
            state.slotForm =  <SlotForm duration={slot.duration} label={slot.label} board={this} index={index}/>;
            //this.forceUpdate();
            return Object.assign({}, state);
        }
        );
        //console.log("EditSlot" , this.state.slotForm)
    }
    editNewSlot(){
        this.state.slots.forEach( (el) => {el.editMode = false;})
        //this.slotForm =  <SlotForm duration={slot.duration} label={slot.label} board={this} index={index}/>;
        this.setState((state)=>{
            state.slotForm =  <SlotForm duration="60" label="New" board={this}/>;
            //this.forceUpdate();
            return Object.assign({}, state);
        });

    }
    addNewSlot(){
        this.setState((state)=>{
            state.slotsStates = state.slotsStates.concat(['pending']);
            let timeLeft = 60000;
            let {label, duration} = {"label":"New", "duration":60}
            //state.slots.push({ timeLeft, duration, label});
            state.slots = state.slots.concat([{ timeLeft, duration, label}]);
            return Object.assign({}, state);
        });
    }
    changeLabel(e){
        this.setState((state)=>{
            state.label = e.target.value;
            return state;
          })
    }
    save(){
        let name = prompt("Please give a name");
        this.state.slots.forEach( (el) => {el.editMode = false;})
        let config = { slots : this.state.slots, label : this.state.label, name : name }
        if( name === "")
            return;
        if( localStorage.getItem(Board.TK_nameprefix + name) )
            {
                let erase = window.confirm("An element with this name already exists, are you sure you want to erase it ?");
                if( erase )
                    localStorage.setItem(Board.TK_nameprefix + name,JSON.stringify(config));
            }
        else
            localStorage.setItem(Board.TK_nameprefix + name,JSON.stringify(config));

    }
    render() {
        var renderSlots = [];var renderCurrentSlots = null;
        //console.log('Board Rendered !',this.state.slotForm)
        this.state.slots.forEach((element, k) => {
                if(!this.state.modeEditor && this.state.slotsStates[k] === "running" )
                    renderCurrentSlots = < Slot label = { element.label }
                    duration = { element.duration }
                    key = { k }
                    index = { k }
                    currentState = { this.state.slotsStates[k] }
                    timeLeft = { element.timeLeft }
                    boardControler = { this.boardControler }
                    board = {this}
                    editMode = {this.state.modeEditor && element.editMode} />
                //else
                //{
                renderSlots.push( < Slot label = { element.label }
                    duration = { element.duration }
                    key = { k }
                    index = { k }
                    currentState = { this.state.slotsStates[k] }
                    timeLeft = { element.timeLeft }
                    boardControler = { this.boardControler }
                    board = {this}
                    modeEditor = {this.state.modeEditor}
                    editMode = {this.state.modeEditor && element.editMode}

                    />);
                //}
                
                
                });
            return <div className={`App-board ${this.state.modeEditor ? 'editor' : ''}`}> 

                <header>
                    <span className="logo">
                        <svg 
                        width="11px" height="24px" viewBox="0 4 28 48">
                        <path fillRule="evenodd"  fill="rgb(29, 123, 65)"
                        d="M3.578,42.848 L24.965,42.848 C26.650,42.848 27.797,41.701 27.797,40.016 L27.797,39.113 C27.797,34.035 21.645,27.101 17.152,22.658 C16.469,21.974 16.469,21.242 17.152,20.534 C21.645,16.090 27.797,9.181 27.797,4.103 L27.797,3.248 C27.797,1.539 26.650,0.392 24.965,0.392 L3.578,0.392 C1.869,0.392 0.722,1.539 0.722,3.248 L0.722,4.103 C0.722,9.181 6.899,16.090 11.366,20.534 C12.074,21.242 12.074,21.974 11.366,22.658 C6.899,27.101 0.722,34.035 0.722,39.113 L0.722,40.016 C0.722,41.701 1.869,42.848 3.578,42.848 ZM4.872,41.017 C4.311,41.017 3.993,40.382 4.530,39.845 L13.271,30.910 C13.612,30.568 13.637,30.446 13.637,30.006 L13.637,20.680 C13.637,20.265 13.612,20.094 13.271,19.801 C10.927,17.677 8.339,14.943 6.484,12.721 C6.166,12.282 6.337,11.891 6.801,11.891 L21.718,11.891 C22.182,11.891 22.377,12.282 22.035,12.721 C20.180,14.943 17.592,17.677 15.248,19.801 C14.906,20.094 14.882,20.265 14.882,20.680 L14.882,30.006 C14.882,30.446 14.906,30.568 15.248,30.910 L23.988,39.845 C24.526,40.382 24.208,41.017 23.671,41.017 L4.872,41.017 Z"/>
                        </svg>&nbsp;
                        <svg 
                        width="42px" height="24px" viewBox="0 0 84 48">
                        <path fillRule="evenodd"  fill="rgb(0, 0, 0)"
                        d="M62.753,20.722 C62.851,28.388 66.830,32.612 72.787,32.612 C77.524,32.612 80.771,30.219 81.772,26.264 L81.820,26.069 L83.066,26.069 L83.017,26.288 C81.991,30.927 78.134,33.735 72.763,33.735 C66.000,33.735 61.532,28.827 61.532,20.649 L61.532,20.624 C61.532,12.470 66.000,7.563 72.470,7.563 C78.964,7.563 83.383,12.446 83.383,20.038 L83.383,20.722 L62.753,20.722 ZM72.470,8.686 C66.879,8.686 62.924,12.983 62.753,19.623 L82.211,19.623 C82.040,12.983 78.085,8.686 72.470,8.686 ZM55.637,16.596 C55.637,11.713 52.927,8.710 48.581,8.710 C44.016,8.710 40.964,12.348 40.964,17.670 L40.964,33.344 L39.768,33.344 L39.768,16.645 C39.768,11.835 36.814,8.710 32.712,8.710 C28.220,8.710 25.095,12.446 25.095,18.403 L25.095,33.344 L23.899,33.344 L23.899,7.953 L25.095,7.953 L25.095,13.666 L25.144,13.666 C25.998,10.248 28.732,7.587 32.858,7.587 C37.033,7.587 39.963,10.492 40.622,13.959 L40.671,13.959 C41.477,10.614 44.284,7.587 48.728,7.587 C53.586,7.587 56.833,10.981 56.833,16.303 L56.833,33.344 L55.637,33.344 L55.637,16.596 ZM16.929,2.778 C16.318,2.778 15.806,2.289 15.806,1.679 C15.806,1.044 16.318,0.580 16.929,0.580 C17.515,0.580 18.027,1.044 18.027,1.679 C18.027,2.289 17.515,2.778 16.929,2.778 ZM4.515,28.388 L4.515,9.052 L0.755,9.052 L0.755,7.953 L4.515,7.953 L4.515,1.093 L5.735,1.093 L5.735,7.953 L11.107,7.953 L11.107,9.052 L5.735,9.052 L5.735,28.290 C5.735,31.318 6.907,32.636 9.495,32.636 C10.179,32.636 10.740,32.587 11.107,32.489 L11.107,33.539 C10.667,33.661 10.008,33.735 9.324,33.735 C6.102,33.735 4.515,32.001 4.515,28.388 ZM17.515,33.344 L16.318,33.344 L16.318,7.953 L17.515,7.953 L17.515,33.344 Z"/>
                        </svg>
                        <svg 
                        width="57px" height="24px" style={{marginLeft:"3px"}} viewBox="0 0 115 48">
                        <path fillRule="evenodd"  fill="rgb(29, 123, 65)"
                        d="M111.547,10.710 C107.348,10.710 104.760,14.372 104.760,19.499 L104.760,35.344 L103.564,35.344 L103.564,9.953 L104.760,9.953 L104.760,15.056 L104.809,15.056 C105.858,11.565 108.202,9.563 111.718,9.563 C112.792,9.563 113.769,9.807 114.281,10.051 L114.281,11.296 C113.695,10.979 112.792,10.710 111.547,10.710 ZM87.976,35.735 C82.995,35.735 79.187,32.243 78.186,27.922 L78.137,27.922 L78.137,43.889 L76.941,43.889 L76.941,9.953 L78.137,9.953 L78.137,17.473 L78.186,17.473 C79.260,13.054 83.020,9.563 87.976,9.563 C94.299,9.563 98.693,14.836 98.693,22.624 L98.693,22.673 C98.693,30.510 94.323,35.735 87.976,35.735 ZM97.497,22.624 C97.497,15.520 93.566,10.686 87.927,10.686 C82.190,10.686 78.137,15.544 78.137,22.624 L78.137,22.649 C78.137,29.729 82.165,34.612 87.927,34.612 C93.591,34.612 97.497,29.778 97.497,22.673 L97.497,22.624 ZM61.475,34.612 C66.211,34.612 69.458,32.219 70.459,28.264 L70.508,28.069 L71.753,28.069 L71.704,28.288 C70.679,32.927 66.821,35.735 61.450,35.735 C54.688,35.735 50.220,30.827 50.220,22.649 L50.220,22.624 C50.220,14.470 54.688,9.563 61.157,9.563 C67.651,9.563 72.070,14.446 72.070,22.038 L72.070,22.722 L51.441,22.722 C51.538,30.388 55.518,34.612 61.475,34.612 ZM70.899,21.623 C70.728,14.983 66.773,10.686 61.157,10.686 C55.566,10.686 51.611,14.983 51.441,21.623 L70.899,21.623 ZM36.048,34.612 C40.784,34.612 44.031,32.219 45.032,28.264 L45.081,28.069 L46.326,28.069 L46.277,28.288 C45.252,32.927 41.395,35.735 36.024,35.735 C29.261,35.735 24.793,30.827 24.793,22.649 L24.793,22.624 C24.793,14.470 29.261,9.563 35.731,9.563 C42.225,9.563 46.644,14.446 46.644,22.038 L46.644,22.722 L26.014,22.722 C26.111,30.388 30.091,34.612 36.048,34.612 ZM45.472,21.623 C45.301,14.983 41.346,10.686 35.731,10.686 C30.140,10.686 26.185,14.983 26.014,21.623 L45.472,21.623 ZM22.413,35.344 L6.935,16.472 L1.515,22.282 L1.515,35.344 L0.294,35.344 L0.294,0.114 L1.515,0.114 L1.515,20.573 L1.612,20.573 L20.704,0.114 L22.267,0.114 L7.814,15.617 L23.976,35.344 L22.413,35.344 Z"/>
                        </svg>
                    </span>
                    <h1>{this.state.label}</h1>

                        {!this.state.modeEditor && 
                        <div id="controls">
                        {this.state.currentrunningState !== "play" && <button className = "square" desc="Start"
                            onClick = {
                                () => this.start()
                            } > &#x25B6; </button>} 
                            {this.state.currentrunningState === "play" && <button className="square" desc="Pause"
                            onClick = {
                                () => this.pause()
                            } ><img src={pauseButton} alt="Pause" title="Pause"/> </button>}

                            <button className = "edit" desc="Edit"
                            onClick = {
                                () => {this.toggleEditor(); }
                            } ><img src={editButton} alt="Edit" title="Edit"/>  </button>
                            <Menu board={this}/>
                            
                        </div>
                        }
                        {this.state.modeEditor &&
                        <div id="editorControls">
                            {/*
                            <button className = "square"
                                onClick = {
                                    () => this.editNewSlot()
                                } > NEW Timer </button>
                            Editeur
                        {this.state.slotForm}*/}

                        <button className = "valid" desc="Edit"
                        onClick = {
                            () => {this.toggleEditor(); }
                        } > OK </button>
                        </div>

                        }

                </header>

            <div id="slotContainer">  
                <div id="sideBar">
                {this.state.modeEditor &&<input 
                                value={this.state.label} onChange={(e) => this.changeLabel(e)} />
                                }
                    
                { renderSlots }
                
                
                {this.state.modeEditor &&<button className = "add"
                                onClick = {
                                    () => this.addNewSlot()
                                } > <img src={addButton} alt="add" title="Add Timer" /> </button>
                                }
                </div> 
                {renderCurrentSlots && <div id="currentSlotContener">{ renderCurrentSlots }</div>} 
            </div>
            
            <ShareConfigBox board={this} url={this.state.shareURL} />
            
            <ConfigLoader board={this} prefixName={Board.TK_nameprefix}/>
            </div>;
            
        }
    }
    export default Board;



class RingAlert{
    audioGong = new Audio("gong.wav");
    audioDing = new Audio("ding.wav");
    gong(){
        this.audioGong.volume = 0.3;
        this.audioGong.play();
    }
    ding(){
        this.audioDing.volume = 0.3;
        this.audioDing.play();
    }
}