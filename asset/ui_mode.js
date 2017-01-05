Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

//used to hold all the save states
Game.UIMode.json_state_data = null;

Game.UIMode.gameStart = {
  enter: function(){
    console.log("entered game start mode");
    Game.Message.send("Start Message");
  },
  exit: function(){
    console.log("exited game start mdoe");
  },
  render: function(display){
    console.log("rendered game start mode");
    display.drawText(5,5,"Welcome");
    display.drawText(5, 6, "press 'n' for a new game and 'l' to load an existing game");
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gamestart");
    if (inputType == 'keypress') {
      if ((inputData.key == 'n') || (inputData.key == 'N') && (inputData.shiftKey)) {
        Game.UIMode.gamePlay.setupPlay();
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
    }
    else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
      if(Game.UIMode.json_state_data !== null){
        Game.UIMode.gamePlay.setupPlay(JSON.parse(json_state_data));
        Game.switchUIMode(Game.UIMode.gameLose);
      }else{
        Game.Message.send("no saved games");
        Game.renderAll();
      }
    }
  }
},

Game.UIMode.gamePlay = {
  attr: {
    _map: null,
    _mapWidth: 300,
    _mapHeight: 200,
    _cameraX: 100,
    _cameraY: 100,
    _avatarX: 100,
    _avatarY: 100
  },
  enter: function(){
    console.log("entered play mode");
    Game.Message.clear();
    Game.Message.send("now game play message");
  },
  exit: function(){
    console.log("exited game play mode");
  },
  render: function(display){
    console.log("rendering in game play");
    this.attr._map.renderOn(display,this.attr._cameraX,this.attr._cameraY);
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
  },
  setupPlay: function (restorationData) {
    var mapTiles = Game.util.init2DArray(this.attr._mapWidth,this.attr._mapHeight,Game.Tile.nullTile);
    var generator = new ROT.Map.Cellular(this.attr._mapWidth,this.attr._mapHeight);
    generator.randomize(0.5);

    // repeated cellular automata process
    var totalIterations = 3;
    for (var i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }

    // run again then update map
    generator.create(function(x,y,v) {
      if (v === 1) {
        mapTiles[x][y] = Game.Tile.floorTile;
      } else {
        mapTiles[x][y] = Game.Tile.wallTile;
      }
    });

    // create map from the tiles
    this.attr._map =  new Game.Map(mapTiles);
  },
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
      Game.Message.clear();
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
      Game.Message.clear();
    }
},

Game.UIMode.gameSave = {
    enter: function(){
      console.log("entered save mode");
      Game.Message.send("now a game save message");
    },
    exit: function(){
      console.log("exiting save mode");
    },
    render: function(display){
      console.log("rendered save mode");
      display.drawText(5,5,"gameSave mode");
      display.drawText(5,6,"Press 's' to save, 'l' to load and 'n' to start a new game, 'r' to resume");
    },
    handleInput: function(inputType, inputData){
      console.log("handling input in game save");
      if (inputType == 'keypress') {
        if ((inputData.key == 's') || (inputData.key == 'S') && (inputData.shiftKey)) {
          if (this.localStorageAvailable()) {
            window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.game)); // .toJSON()
          }
          else {
            console.log("no local storage availible");
          }
          Game.switchUIMode(Game.UIMode.gamePlay);
        }
      }
      else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
          json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
          console.log(json_state_data);
          var state_data = JSON.parse(json_state_data);
          console.dir(state_data);
          Game.setRandomSeed(state_data._randomSeed);
          Game.UIMode.gamePlay.setupPlay(Game.UIMode.state_data);
          Game.switchUIMode(Game.UIMode.gamePlay);
      }
      else if ((inputData.key == 'n') || (inputData.key == 'N') && (inputData.shiftKey)) {
          Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
          Game.UIMode.gamePlay.setupPlay();
          Game.switchUIMode(Game.UIMode.gamePlay);
      }
      else if ((inputData.key == 'r') || (inputData.key == 'R') && (inputData.shiftKey)) {
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
