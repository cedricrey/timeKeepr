import React, {  useState, useEffect, useRef } from "react";
import menuButton from "./menu.svg";
import saveButton from "./save.svg";
import shareButton from "./share.svg";
import loadButton from "./square.grid.2x2.svg";

function Menu(props) {
    const [displayMenu, setDisplayMenu] = useState( false );
    let menuRef = useRef();
    const board = props.board;
    useEffect(()=>{
      //console.log('menu useEffect')
        let handler = (e) => {
            if(!menuRef.current.contains(e.target))
                setDisplayMenu(false);
        }
        document.addEventListener('mousedown',handler);
        return () => document.removeEventListener('mousedown',handler);
    },[menuRef])
    
    function toggleMenu(){
        setDisplayMenu(!displayMenu);
    }
    return <div id="menuContainer">
      <button href="#" id="toggleMenu" onClick={() => toggleMenu()}>
        <img src={menuButton} alt="Menu" title="Menu" />
      </button>
      <nav className={displayMenu ? "displayed" : "hidden"} ref={menuRef}>
        <button className="square" onClick={() => {board.openConfigBox()}}>
          <img src={loadButton} alt=" "/> Load...{" "}
        </button>
        <button onClick={() => board.save()}>
          <img src={saveButton} alt=" "/> Save...
        </button>
        <button onClick={() => board.shareCurrentConfig()}>
          <img src={shareButton} alt=" "/> Share...
        </button>
      </nav>
    </div>;
}
export default Menu;
