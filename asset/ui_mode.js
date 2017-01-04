Game.UIMode = {};

Game.UIMode.gameStart = {
  enter: function(){
    console.log("entered game start mode");
  },
  exit: function(){
    console.log("exited game start mdoe");
  },
  render: function(display){
    console.log("rendered game start mode");
    display.drawText(5,5,"gamestart mode");
    display.drawText(10, 10, "press any key");
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gamestart");
    if (inputData.charCode !== 0) { // ignore the various modding keys - control, shift, etc.
     Game.switchUIMode(Game.UIMode.gamePlay);
    }
  }
},

Game.UIMode.gamePlay = {
  enter: function(){
    console.log("entered play mode");
  },
  exit: function(){
    console.log("exited game play mode");
  },
  render: function(display){
    console.log("rendering in game play");
    display.drawText(5,6,"gameplay mode");
    display.drawText(5,7,"W to win and L to Lose");
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gameplay");
    if (inputType == 'keypress') {
      if ((inputData.key == 'h') || (inputData.key == 'L') && (inputData.shiftKey)) {
        Game.switchUIMode(Game.UIMode.gameWin);
      }
    }
    else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
        Game.switchUIMode(Game.UIMode.gameLose);
    }
  }
},

Game.UIMode.gameWin = {
    enter: function(){
      console.log("entered win mode");
    },
    exit: function(){
      console.log("exiting win mode");
    },
    render: function(display){
      console.log("rendered win mode");
      display.drawText(5,5,"You Win");
    },
    handleInput: function(inputType, inputData){
      console.log("handling input in game win");
    }
},

Game.UIMode.gameLose = {
    enter: function(){
      console.log("entered lose mode");
    },
    exit: function(){
      console.log("exiting lose mode");
    },
    render: function(display){
      console.log("rendered lose mode");
      display.drawText(5,5,"gamelose mode");
    },
    handleInput: function(inputType, inputData){
      console.log("handling input in game lose");
    }
};
