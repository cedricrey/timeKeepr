
// import React, { Component } from "react";
// class ConfigLoader extends Component {
//     constructor(props) {
//         super(props);
//         //this.
//         this.state = {
//             configs : []
//         };
//         for ( var i = 0, len = localStorage.length; i < len; ++i ) {
//             //console.log( localStorage.getItem( localStorage.key( i ) ) );
//             var name = localStorage.key( i );
//             if( name.match(this.props.prefixName ) )
//                 this.state.configs.push( name ) ;
//           }
//     }
//     chooseElement( name ){
//         console.log("choose : ", name)
//       this.props.board.updateConfig(name);
//     }
//     render(){
//         var configList = [];
//         this.state.configs.forEach((element, k) => {
//             let name = element.replace(this.props.prefixName,'');
//             configList.push( <li name = { name } index={k} onClick={() => this.chooseElement(name)} key={k}>{ name }</li> );
//         });
//         return <ul id="loader">
//             {configList}
//         </ul>
//     }
//     }
// export default ConfigLoader;

import React, { useEffect, useRef } from "react";
import deleteIcon from './delete.svg';
function ConfigLoader( props ) {
    const board = props.board;
    const prefixName = props.prefixName;
    const configs = [];
    const congigLoaderBoxRef = useRef();
    useEffect(()=>{
        //console.log('useEffect Loader')
        let handler = (e) => {
            if(!congigLoaderBoxRef.current.contains(e.target))
                board.closeConfigBox();
        }
        document.addEventListener('mousedown',handler);
        return () => document.removeEventListener('mousedown',handler);
    },[congigLoaderBoxRef])
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        //console.log( localStorage.getItem( localStorage.key( i ) ) );
        var name = localStorage.key( i );
        if( name.match( prefixName ) )
            configs.push( name ) ;
        }
    
    function chooseElement( name ){
      //console.log("choose : ", name)
      board.updateConfig(name);
      board.closeConfigBox();
    }
    
    function deleteElement( name ){
        board.deleteSave(name);
        board.closeConfigBox();
      }

    var configList = [];
    configs.forEach((element, k) => {
        let name = element.replace(prefixName,'');
        if( name != "")
        configList.push( <li  key={k}><span name = { name } index={k} onClick={() => chooseElement(name)} key={k}>{ name }</span>        
        <button onClick = {() => deleteElement(name)} className="delete"> <img src={deleteIcon} alt="Delete" title="delete" />   </button>
        </li> );
    });
    return <div className="modal" ref={congigLoaderBoxRef} style={{display:board.displayConfigBox ? "block" : "none"}}>
        <h2>Load a locally saved project</h2>
        <ul id="loaderList">
        {configList}
        </ul>
    </div>
    }
export default ConfigLoader;
