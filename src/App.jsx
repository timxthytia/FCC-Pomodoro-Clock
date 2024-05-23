import {Component, useRef } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons'
import alarmSound from "./assets/alarmSound.mp3"


class App extends Component {
  state = {
    timerOn: false,
    break: false,
    timer: 1500,
    breakTime:5,
    sessionTime: 25
  }
  

  handleIncrement = (type) => {
    if (type == "break"){
      if (this.state.breakLength < 1 || this.state.breakTime >= 60) return;
      this.setState({breakTime : this.state.breakTime + 1});
    }

    else {
      if (this.state.sessionTime < 1 || this.state.sessionTime >= 60) return;
      this.setState({sessionTime: this.state.sessionTime + 1});
      this.setState({timer: (this.state.sessionTime + 1) * 60});      
    }
  }

  handleDecrement = (type) => {
    if (type == "break"){
      if (this.state.breakTime <= 1 || this.state.breakTime > 60) return;
      this.setState({breakTime : this.state.breakTime - 1});
    }

    else {
      if (this.state.sessionTime <= 1 || this.state.sessionTime > 60) return;
      this.setState({sessionTime: this.state.sessionTime - 1});
      this.setState({timer: (this.state.sessionTime - 1) * 60});    
    }
  }


  startStopTimer = () => {
    if (this.state.timerOn === true) {
      console.log(this.state);
      this.setState({ timerOn: false});
      clearInterval(this.timer);
    } 
    
    else if (this.state.timerOn === false) {
      this.setState({ timerOn: true });
      if (this.state.timer > 0) {
        this.timer = setInterval(() => {
          let currTimer = this.state.timer;
          let breakStatus = this.state.break;
          let alarm = document.getElementById("beep");
          
          if (currTimer > 0) {
            currTimer -= 1;
          } 
          
          else if (currTimer === 0 && breakStatus === false) {
            currTimer = this.state.breakTime * 60;
            breakStatus = true;
            alarm.play();
          } 
          
          else if (currTimer === 0 && breakStatus === true) {
            currTimer = this.state.sessionTime * 60;
            breakStatus = false;
          }
          
          this.setState({
            timer: currTimer,
            break: breakStatus
          });
        }, 1000);
      };
    };
  };


  reset = () => {
    this.setState({
      timerOn: false,
      break: false,
      timer: 1500,
      breakTime: 5,
      sessionTime: 25,
    });
    clearInterval(this.timer);
    let beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  };

  
  
  render() {
    let minute = Math.floor(this.state.timer / 60);
    let second = (this.state.timer % 60);

  return (
    <div id="background">
      <h1 style={{fontWeight: "500", textAlign: "center"}}>25 + 5 Clock</h1>
      <div className="container">
        <div className="break-container">
          <div id="break-label">Break Length</div>
          <div className="break-buttons">
            <button id="break-decrement" onClick= {() => this.handleDecrement("break")}><FontAwesomeIcon icon={faArrowDown}/></button>
            <div id="break-length">{this.state.breakTime}</div>
            <button id="break-increment"  onClick={() => this.handleIncrement("break")}><FontAwesomeIcon icon={faArrowUp}/></button>
          </div>
        </div>
        <div className="session-container">
          <div id="session-label">Session Length</div>
          <div className="session-buttons">
            <button id="session-decrement" onClick={() => this.handleDecrement("session")}><FontAwesomeIcon icon={faArrowDown}/></button>
            <div id="session-length">{this.state.sessionTime}</div>
            <button id="session-increment" onClick={() => this.handleIncrement("session")}><FontAwesomeIcon icon={faArrowUp}/></button>
          </div>
        </div>
      </div>
      <div className="timer-container">
          <div id="timer-label">{this.state.break === true ? "Break" : "Session"}</div>
          <div id="time-left">
            <h1>
              {minute?.toString().length === 1 ? `0${minute}` : minute}
              :{second?.toString().length === 1 ? `0${second}` : second}
            </h1>
          </div>
          <div className="timer-buttons">
            <button id="start_stop" onClick={this.startStopTimer}><FontAwesomeIcon icon={faPlay}/><FontAwesomeIcon icon={faPause}/></button>
            <button id="reset" onClick={this.reset}><FontAwesomeIcon icon={faRefresh}/></button>
          </div>
      </div>
      <audio ref={this.audio} style={{ display: "none" }} src={alarmSound} id="beep"></audio>
    </div>
  );
}
}

export default App;
