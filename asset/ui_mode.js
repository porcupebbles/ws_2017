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
    _cameraX: 5,
    _cameraY: 5,
    _avatarX: 5,
    _avatarY: 5
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
    this.renderAvatar(display);
  },
  renderAvatar: function (display) {
    Game.Symbol.AVATAR.draw(display,this.attr._avatarX-this.attr._cameraX+display._options.width/2,
                                    this.attr._avatarY-this.attr._cameraY+display._options.height/2);
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.attr._avatarX,fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.attr._avatarY,fg,bg); // DEV
  },
  moveAvatar: function (dx,dy) {
    //this is probably the best place to handle not walking into walls etc.
    this.attr._avatarX = Math.min(Math.max(0,this.attr._avatarX + dx),this.attr._mapWidth);
    this.attr._avatarY = Math.min(Math.max(0,this.attr._avatarY + dy),this.attr._mapHeight);
    this.setCameraToAvatar();
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx,sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.attr._mapWidth);
    this.attr._cameraY = Math.min(Math.max(0,sy),this.attr._mapHeight);
  },
  setCameraToAvatar: function () {
    this.setCamera(this.attr._avatarX,this.attr._avatarY);
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gameplay");
    if(inputType == 'keypress'){
      switch(inputData.key){
        case 'w':
        console.log("hit w");
        this.moveAvatar(0,-1);
        break;
        case 'a':
        console.log("hit a");
        this.moveAvatar(-1,0);
        break;
        case 's':
        console.log("hit s");
        this.moveAvatar(0,1);
        break;
        case 'd':
        console.log("hit d");
        this.moveAvatar(1,0);
        break;
      }
      Game.refresh();
    }
  },
  setupPlay: function (restorationData) {
    // create map from the tiles
    this.attr._map =  new Game.Map(Game.Map_Gen.basicMap(this.attr._mapWidth,this.attr._mapHeight));
    console.dir(this.attr._map);
  },
},

Game.UIMode.gameWin = {
    enter: function(){
      console.log("entered win mode");
      Game.Message.clear();
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
