import React, { Component } from "react";
import checkMark from "./checkmark.circle.svg";
import deleteIcon from "./delete.svg";
class Slot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.duration * 1000,
      label: this.props.label,
      durationDisplay: this.getDurationDisplayString(props.duration),
    };
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
  changeLabel(e) {
    this.setState((state) => {
      state.label = e.target.value;
      this.props.board.validateSlotForm(this);
      return state;
    });
  }
  resetSlotTimer(e) {
    this.props.board.resetSlotTimer(this.props.index);
  }
  getDurationFromLabel() {
    console.log(this.state.durationDisplay, this.state.durationDisplay.match(
        new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$", "i")
      ))
    if (
      this.state.durationDisplay.match(
        new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$", "i")
      )
    ) {
      let decomposeDisplay = new RegExp(
        "^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$",
        "i"
      ).exec(this.state.durationDisplay);
      return (
        parseInt(decomposeDisplay[1]) * 3600 +
        parseInt(decomposeDisplay[2]) * 60 +
        parseInt(decomposeDisplay[3])
      );
    } else if (
      this.state.durationDisplay.match(
        new RegExp("^([0-9]{1,9}):([0-5][0-9])$", "i")
      )
    ) {
      let decomposeDisplay = new RegExp(
        "^([0-9]{1,9}):([0-5][0-9])$",
        "i"
      ).exec(this.state.durationDisplay);
      return parseInt(decomposeDisplay[1]) * 60 + parseInt(decomposeDisplay[2]);
    }
  }
  getDurationDisplayString(duration) {
    let hours = Math.floor(parseInt(duration) / 3600);
    let minutes = Math.floor((parseInt(duration) % 3600) / 60);
    let seconds = Math.floor(parseInt(duration) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  handleTitleChange(event) {
    //this.handleDuration();
    this.setState((state) => {
      state.label = event.target.value;
      return state;
    });
  }
  handleDurationDisplay() {
    //this.props.durationDisplay = "00:00:00";
    //console.log("hey :", this.props.duration)
    if (this.props.duration) {
      let displayString = this.getDurationDisplayString(this.props.duration);
      this.setState((state) => {
        state.durationDisplay = displayString;
        return state;
      });
    }
  }
  handleDuration(event) {
    //console.log('YO', this);
    //let decomposeDisplay = (new RegExp("^([0-9]{1,9}):([0-5][0-9]):([0-5][0-9])$",'i')).exec(event.target.value);
    //this.props.duration = parseInt(decomposeDisplay[1])*3600 + parseInt(decomposeDisplay[2])*60 + parseInt(decomposeDisplay[3]);
    this.setState((state) => {
      state.durationDisplay = event.target.value;
      this.props.board.validateSlotForm(this);
      return state;
    });
    //console.log("Duration in seconds : ", this.getDurationFromLabel(event.target.value))
  }
  getLeftTimeHSLColor(timeLeft, duration) {
    const startColor = [143, 62, 30];
    const endColor = [59, 100, 42];
    let colorMult = 1 - timeLeft / (duration * 1000);
    let colorH = startColor[0] + (endColor[0] - startColor[0]) * colorMult;
    let colorS = startColor[1] + (endColor[1] - startColor[1]) * colorMult;
    let colorL = startColor[2] + (endColor[2] - startColor[2]) * colorMult;
    return [
      colorH.toFixed(2),
      colorS.toFixed(2) + "%",
      colorL.toFixed(2) + "%",
    ];
  }
  render() {
    let factor = this.props.timeLeft / (this.props.duration * 1000);
    let widthP = factor.toFixed(3) * 100;
    let hsl = this.getLeftTimeHSLColor(
      this.props.timeLeft,
      this.props.duration
    );
    /*var colorH = this.props.timeLeft / (this.props.duration * 1000);
        var widthP = colorH.toFixed(3) * 100;
        colorH = colorH.toFixed(3) * 120;*/
    var angle = (Math.PI * widthP) / 100;
    //let mark = <span dangerouslySetInnerHTML={{ __html : "&#9679"}} style={{color:`hsl(${colorH},50%,50%)`}}></span>;
    let mark = (
      <span
        dangerouslySetInnerHTML={{ __html: "&#9679" }}
        style={{ color: `hsl(${hsl.join(",")})` }}
      >
        
      </span>
    );
    if (this.props.currentState === "finished")
      mark = <img src={checkMark} alt="✓" style={{ width: "11px" }} />;

    return (
      //<div className={ "Slot " + this.props.currentState + " " + (this.props.editMode ? "editing" : "")} style={{"color" : `hsl(${colorH},50%,50%)`}}>
      <div
        className={
          "Slot " +
          this.props.currentState +
          " " +
          (this.props.editMode ? "editing" : "")
        }
        style={{ color: `hsl(${hsl.join(",")})` }}
      >
        <span className="title">
          
          {this.props.modeEditor && (
            <input
              type="text"
              value={this.props.label}
              onChange={(e) => this.changeLabel(e)}
            />
          )}
          {!this.props.modeEditor && (<span>
              <span className="mark"> {mark} </span>{this.props.label}
            </span>
          )}
          {!this.props.modeEditor && this.props.currentState === "running" && (
            <button
              type="text"
              label=""
              onClick={(e) => this.resetSlotTimer(e)}
            >⟲
            </button>
          )}
        </span>
        <span
          className="timebar"
          style={{
            font: "italic normal 13px Arial",
            backgroundColor: `hsl(${hsl.join(",")})`,
            width: `${widthP}%`,
          }}
        >
          
          & nbsp;
        </span>
        {!this.props.modeEditor && (
          <span className="fixedNumber timeLeft">
            
            {durationLabel(this.props.timeLeft / 1000)}
          </span>
        )}
        {!this.props.modeEditor && (
          <svg
            strokeWidth="3"
            fill="none"
            stroke={`hsl(${hsl.join(",")})`}
            viewBox="0 0 100 24"
          >
            
            {/*<circle cx="50" cy="50" stroke-width="5" fill="none" stroke={`hsl(${colorH},50%,50%)`} r="30"/>*/}
            <path
              d={f_svg_ellipse_arc([50, 25], [20, 20], [0, angle], Math.PI)}
            />
          </svg>
        )}
        {this.props.modeEditor && (
          <input
            className="timePicker"
            type="time"
            value={this.state.durationDisplay}
            onChange={(e) => this.handleDuration(e)}
            placeholder="Duration"
            pattern="^[0-9]{1,9}:[0-5][0-9]:[0-5][0-9]$"
            step="1"
          />
        )}
        {/* durationLabel(this.props.duration) */}
        {this.props.modeEditor && (
          <div>
            
            {/*<button onClick = {() => this.props.boardControler.editSlot(this.props.index)}>Edit</button>*/}
            <button
              onClick={() =>
                this.props.boardControler.deleteSlot(this.props.index)
              }
              className="delete"
            >
              
              <img src={deleteIcon} alt="Delete" title="delete" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

//http://xahlee.info/js/svg_circle_arc.html
const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;
const f_matrix_times = ([[a, b], [c, d]], [x, y]) => [
  a * x + b * y,
  c * x + d * y,
];
const f_rotate_matrix = (x) => [
  [cos(x), -sin(x)],
  [sin(x), cos(x)],
];
const f_vec_add = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2];
const f_svg_ellipse_arc = ([cx, cy], [rx, ry], [t1, Δ], φ) => {
  Δ = Δ % (2 * π);
  const rotMatrix = f_rotate_matrix(φ);
  const [sX, sY] = f_vec_add(
    f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]),
    [cx, cy]
  );
  const [eX, eY] = f_vec_add(
    f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]),
    [cx, cy]
  );
  const fA = Δ > π ? 1 : 0;
  const fS = Δ > 0 ? 1 : 0;
  //const path_2wk2r = document.createElementNS("http://www.w3.org/2000/svg", "path");
  //path_2wk2r.setAttribute("d", "M " + sX + " " + sY + " A " + [ rx , ry , φ / (2*π) *360, fA, fS, eX, eY ].join(" "));
  //return path_2wk2r;
  return (
    "M " +
    sX +
    " " +
    sY +
    " A " +
    [rx, ry, (φ / (2 * π)) * 360, fA, fS, eX, eY].join(" ")
  );
};

const durationLabel = (duration) => {
  let hours = Math.floor(parseInt(duration) / 3600);
  let minutes = Math.floor((parseInt(duration) % 3600) / 60);
  let seconds = Math.floor(parseInt(duration) % 60);
  let hoursLabel = hours > 0 ? hours.toString().padStart(2, "0") + ":" : "";
  let minutesLabel =
    hours > 0 || minutes > 0 ? minutes.toString().padStart(2, "0") + ":" : "";
  let secondsLabel =
    seconds.toString().padStart(2, "0") +
    (hours === 0 && minutes === 0 ? "s" : "");

  return `${hoursLabel}${minutesLabel}${secondsLabel}`;
};

export default Slot;
