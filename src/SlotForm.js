
import React, { Component } from "react";
class SlotForm extends Component {
    constructor(props) {
            super(props);
            this.state = { timeLeft: props.duration * 1000 , label : this.props.label, durationDisplay : this.getDurationDisplayString(props.duration) }
            console.log('SlotForm Constructor !', this.props) 
            //this.handleDurationDisplay();
        }
    componentDidUpdate(prevProps) {
      if (prevProps.label !== this.props.label) 
        this.setState( state => {state.label = this.props.label; return state})
      if (prevProps.duration !== this.props.duration) 
          this.setState( state => {state.duration = this.props.duration; this.handleDurationDisplay();return state})
    }
    
    handleTitleChange(event){
      //this.handleDuration();
      this.setState( state => {state.label = event.target.value; return state})
    }
    getDurationDisplayString( duration ){
      let hours = Math.floor(parseInt(duration) / 3600);
      let minutes = Math.floor(parseInt(duration) % 3600 / 60);
      let seconds = Math.floor(parseInt(duration) % 60);
      return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
      
    }
    handleDurationDisplay(){
      //this.props.durationDisplay = "00:00:00";
      //console.log("hey :", this.props.duration)
      if(this.props.duration)
      {
        let displayString = this.getDurationDisplayString( this.props.duration );
        this.setState( state => {state.durationDisplay = displayString;return state})
      }
    }
    handleDuration( event ){
      //console.log('YO', this);
      //let decomposeDisplay = (new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$",'i')).exec(event.target.value);
      //this.props.duration = parseInt(decomposeDisplay[1])*3600 + parseInt(decomposeDisplay[2])*60 + parseInt(decomposeDisplay[3]);
      this.setState( state => {state.durationDisplay = event.target.value; return state})
      //console.log("Duration in seconds : ", this.getDurationFromLabel(event.target.value))
    }
    getDurationFromLabel(){
      let decomposeDisplay = (new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$",'i')).exec(this.state.durationDisplay);
      return parseInt(decomposeDisplay[1])*3600 + parseInt(decomposeDisplay[2])*60 + parseInt(decomposeDisplay[3]);
    }
    validate(){
      //console.log('SLOTFORM Validate')
      this.props.board.validateSlotForm(this)
    }
        /*

        start(){
          this.setState({ lastRefresh : new Date()});
          if( this.state.timeLeft > 0 )
              this.currentInterval = setInterval( ()=> { this.decreaseTimer();}, 10);
        }
        pause(){
          clearInterval( this.currentInterval );
        }
        decreaseTimer(){
          var diff = new Date() - this.state.lastRefresh;
          if( diff < this.state.timeLeft )
            this.setState({ lastRefresh : new Date(), timeLeft : this.state.timeLeft-diff});
          else
            {
              this.setState({ timeLeft : 0 });
              clearInterval( this.currentInterval);
              //this.props.boardControler.next();
            }
        }
        */
    render() {
        //var colorH = this.props.timeLeft / (this.props.duration * 1000);
        //console.log('SlotForm Rendered !', this.props)
        return ( 
          <div> 
            <label>Title</label><input type="text" value={ this.state.label } placeholder="Slot Title" onChange={(e) => this.handleTitleChange(e) }/> <br />
            <label>Duration</label><input type="time" value={ this.state.durationDisplay } onChange={(e) => this.handleDuration(e)} placeholder="Duration" pattern="^[0-9]{1,9}:[0-5][0-9]:[0-5][0-9]$" step="1"/>
            <button onClick={() => this.validate()}>{parseInt(this.props.index) >= 0 ? "Update" : "Add"}</button>
          </div>
        );

    }
}
export default SlotForm;