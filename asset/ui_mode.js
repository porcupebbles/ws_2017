Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function(){
    console.log("entered game start mode");
    //Game.message.send();
  },
  exit: function(){
    console.log("exited game start mdoe");
  },
  render: function(display){
    console.log("rendered game start mode");
    display.drawText(5,5,"gamestart mode");
    display.drawText(5, 6, "press any key");
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gamestart");
    if (inputData.charCode !== 0) { // ignore the various modding keys - control, shift, etc.
     Game.switchUIMode(Game.UIMode.gameSave);
    }
  }
},

Game.UIMode.gamePlay = {
  enter: function(){
    console.log("entered play mode");
    //Game.message.clear();
  },
  exit: function(){
    console.log("exited game play mode");
  },
  render: function(display){
    console.log("rendering in game play");
    display.drawText(5,5,"gameplay mode");
    display.drawText(5,6,"W to win and L to Lose and S to Save");
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gameplay");
    if (inputType == 'keypress') {
      if ((inputData.key == 'w') || (inputData.key == 'W') && (inputData.shiftKey)) {
        Game.switchUIMode(Game.UIMode.gameWin);
      }
    }
    else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
        Game.switchUIMode(Game.UIMode.gameLose);
    }
    else if ((inputData.key == 's') || (inputData.key == 'S') && (inputData.shiftKey)) {
        Game.switchUIMode(Game.UIMode.gameSave);
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
      //Game.Message.clear();
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
      //Game.message.clear();
    }
},

Game.UIMode.gameSave = {
    enter: function(){
      console.log("entered save mode");
    },
    exit: function(){
      console.log("exiting save mode");
    },
    render: function(display){
      console.log("rendered save mode");
      display.drawText(5,5,"gameSave mode");
      display.drawText(5,6,"Press 's' to save, 'l' to load and 'n' to start a new game");
    },
    handleInput: function(inputType, inputData){
      console.log("handling input in game save");
      if (inputType == 'keypress') {
        if ((inputData.key == 's') || (inputData.key == 'S') && (inputData.shiftKey)) {
          if (this.localStorageAvailable()) {
            //console.dir(JSON.stringify(Game.game));
            window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.game)); // .toJSON()
          }
          else {
            console.log("no local storage availible");
          }
          Game.switchUIMode(Game.UIMode.gamePlay);
        }
      }
      else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
          var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
          console.log(json_state_data);
          var state_data = JSON.parse(json_state_data);
          console.dir(state_data);
          Game.setRandomSeed(state_data._randomSeed);
          Game.switchUIMode(Game.UIMode.gamePlay);
      }
      else if ((inputData.key == 'n') || (inputData.key == 'N') && (inputData.shiftKey)) {
          Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
          Game.switchUIMode(Game.UIMode.gamePlay);
      }

    },

    localStorageAvailable: function () { // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  	   try {
  		    var x = '__storage_test__';
  		    window.localStorage.setItem(x, x);
  		    window.localStorage.removeItem(x);
  		    return true;
  	     }
  	    catch(e) {
          Game.Message.send('Sorry, no local data storage is available for this browser');
  		    return false;
  	    }
  }
};
