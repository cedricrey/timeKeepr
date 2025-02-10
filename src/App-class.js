import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";

class App extends Component{
  constructor(props){
    super( props );
    this.board = <Board slots='[{"label":"Intro","duration":15},{"label":"Main","duration":10}]'/>;
  }

    startTimer(){
        //this.Slot.start();
        //console.log( this );
        //this.board.start();
    }

  render(){  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload....
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 
        </a>
        {this.board}
      </header>
    </div>
  );}
}
class Board extends Component{
  constructor(props) {
      super(props);
      this.state = {
        slotsStates: [],
        test : 'init'
      };
      console.log('Construct...',this);
      this.slots = new Array();
      // console.log(props.slots)
      if(props.slots)
        {
        let slots = JSON.parse(props.slots);
        //let slotsStates = [];
        //this.setState( { slotsStates } );
        
        slots.forEach((sProps, k)=>{
          this.state.slotsStates.push('pending');
          //this.slots.push(<Slot label={sProps.label} duration={sProps.duration} key={k} currentState={this.state.slotsStates[k]} currentTest={this.state.test}/>);
          this.slots.push(sProps);       
        })
        //this.setState( { slotsStates } );
        }
      this.currentRunningSlot = this.slots[0] || null;
      console.log("this.slotsStates",this.slotsStates)
      //this.start();
  }
    start(){      
      //let start = new Date();
      if(this.currentRunningSlot)
      {  
        //var end = new Date();
        //end.setSeconds( end.getSeconds() + this.currentRunningSlot.props.duration);
        this.currentTimeout = setTimeout(this.next.bind(this), this.currentRunningSlot.duration * 1000);
        //this.currentRunningSlot.start();
        let index = this.slots.indexOf( this.currentRunningSlot );

        this.setState( state => {
          var slotsStates = state.slotsStates;
          
          slotsStates[index] = "runing";
          return {
            slotsStates
          };
        })      
      }      
    console.log( this );
  }
  pause(){
      
  }
  next(){
    let index = this.slots.indexOf( this.currentRunningSlot );

    this.setState( state => {
      var slotsStates = state.slotsStates;
      slotsStates[index] = "finnished";
      return {
        slotsStates
      };
    })  

    if( index < this.slots.length -1 )
      {
        this.currentRunningSlot = this.slots[ index + 1];
        this.start(); 
      }
  }
  render(){
    var renderSlots = [];
    this.slots.forEach( (element,k) => {
      renderSlots.push(<Slot label={element.label} duration={element.duration} key={k} currentState={this.state.slotsStates[k]} currentTest={this.state.test}/>);
    });
    return  <div><button className="square" onClick={() => this.start()}>Start</button>
            <div>{renderSlots}</div>
            
            </div>;
  }
}
class Slot extends Component{
    render(){
        return (
            <div className="Slot">
                {this.props.label}  : {this.props.currentState} 
            </div>
          );
    }
}

export default App;
