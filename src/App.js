//import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import Board from "./Board";

var slots = null;// = [{ "label": "Partie 1", "duration": 3 }, { "label": "Partie 2", "duration": 15 }];
var slotsName = null;

var search = document.location.search.replace(/\?/, "").split('&');
var searchObj = {};
search.map(e => {
    let s = e.split("=");
    let o = {};
    searchObj[s[0]] = s[1];
    return o;
});
if (searchObj['s']) {
    slots = JSON.stringify(JSON.parse(decodeURIComponent(searchObj['s'])));
}

if (searchObj['b']) {
    slots = JSON.stringify(JSON.parse(atob(decodeURIComponent(searchObj['b']))));
    //console.log(atob(decodeURIComponent(searchObj['b'])))
}

if (searchObj['n']) {
    slotsName = searchObj['n'];
}

class App extends Component {
    constructor(props) {
        super(props);
        this.board = <Board slots={slots} slotsName={slotsName}/> ;
    }

    startTimer() {
        //this.Slot.start();
        //console.log( this );
        //this.board.start();
    }

    render() {
        return ( <div className="App">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
            <meta name="theme-color" content="#1d7b41"></meta>
            <meta name="author" content="Hello my name is"></meta>{ this.board } </div>
        );
    }
}

    

    export default App;