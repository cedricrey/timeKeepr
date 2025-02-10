
import React,  {  useState, useEffect, useRef } from "react";
function ShareConfigBox( props ){
    const shareBoxRef = useRef();
    useEffect(()=>{
        //console.log('useEffect')
        let handleree = (e) => {
            if(!shareBoxRef.current.contains(e.target))
                props.board.closeShareBox();
        }
        document.addEventListener('mousedown',handleree);
        return () => document.removeEventListener('mousedown',handleree);
        //return ;
    },[shareBoxRef])
    //console.log("shareconfig : ",props.board.state)
    return <div className="modal" id="shareBox" ref={shareBoxRef} style={{display:props.board.displayShareBox ? "block" : "none"}}>
            <h2>Share</h2>
            <ul>
                <li><label htmlFor="url">URL </label> <input name="url" defaultValue={props.url} className="urlShare"/></li>
                <li><a href={`sms:?body=${props.url}`}> SMS </a></li>
                <li><a href={`mailto:?subject=TimeKeeper&body=${props.url}`}> Email </a></li>
            </ul>
        </div>;

}

export default ShareConfigBox;