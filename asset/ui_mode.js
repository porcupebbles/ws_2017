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
    Game.Message.send("Another Message 1");
    Game.Message.send("Another Message 2");
    Game.Message.send("Another Message 3");
    Game.Message.send("Another Message 4");
    Game.Message.send("Another Message 5");
    Game.Message.send("Another Message 6");
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
        Game.UIMode.gameSave.newGame();
      }
    }
    else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
      Game.UIMode.gameSave.saveGame();
    }
    //for testing
    else if((inputData.key == 'i') || (inputData.key == 'I') && (inputData.shiftKey)){
      if(Game.Message._messageNum > 0){
        Game.Message._messageNum--;
      }
    } else if((inputData.key == 'k') || (inputData.key == 'K') && (inputData.shiftKey)){
      if(Game.Message._messageNum < Game.Message._curMessages.length+1-Game.display.message.h){
        Game.Message._messageNum++;
      }
    }
    console.log(inputData.key);
    Game.refresh();
  }
},

Game.UIMode.gamePlay = {
  JSON_KEY: 'uiMode_gamePlay',
  attr: {
    _map: null,
    _mapWidth: 300,
    _mapHeight: 200,
    _cameraX: 5,
    _cameraY: 5,
    avatar: null
  },
  enter: function(){
    console.log("entered play mode");
    Game.Message.clear();
    Game.Message.send("now game play message");

    Game.keyBinding.setTemplate("arrows");
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
    Game.Symbol.AVATAR.draw(display,this.attr.avatar.getX()-this.attr._cameraX+display._options.width/2,
                                    this.attr.avatar.getY()-this.attr._cameraY+display._options.height/2);
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.attr.avatar.getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.attr.avatar.getY(),fg,bg); // DEV
    display.drawText(1,4,"Turns: " + this.attr.avatar.getTurns(),fg,bg);
    display.drawText(1,5,"HP: " + this.attr.avatar.getCurHp(),fg,bg);
  },
  moveAvatar: function (dx,dy) {
    //this is probably the best place to handle not walking into walls etc.
    //this.attr.avatar.setX(Math.min(Math.max(0,this.attr.avatar.getX() + dx),this.attr._mapWidth));
    //this.attr.avatar.setY(Math.min(Math.max(0,this.attr.avatar.getY() + dy),this.attr._mapHeight));
    this.attr.avatar.tryWalk(this.attr._map, dx, dy);
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
    this.setCamera(this.attr.avatar.getX(),this.attr.avatar.getY());
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in gameplay");
    if(inputType == 'keypress' || inputType == 'keydown'){ //this is suspect
      switch(inputData.key){
        case Game.keyBinding._curKeys["up"]:
        console.log("got here");
        this.moveAvatar(0,-1);
        break;
        case Game.keyBinding._curKeys["left"]:
        this.moveAvatar(-1,0);
        break;
        case Game.keyBinding._curKeys["down"]:
        this.moveAvatar(0,1);
        break;
        case Game.keyBinding._curKeys["right"]:
        this.moveAvatar(1,0);
        break;
        case Game.keyBinding._curKeys["save_screen"]:
        Game.switchUIMode(Game.UIMode.gameSave);
        break;
        case 'q':
        Game.switchUIMode(Game.UIMode.gameOptions);
        break;
      }
      Game.refresh();
    }
  },
  setupPlay: function (restorationData) {
    // create map from the tiles
    this.attr._map =  new Game.Map(Game.Map_Gen.basicMap(this.attr._mapWidth,this.attr._mapHeight));
    this.attr.avatar = new Game.Entity(Game.EntityTemplates.Avatar);
    console.dir(this.attr._map);
  },

  toJSON: function() {
    return Game.UIMode.gameSave.BASE_toJSON.call(this);
  },
  fromJSON: function (json) {
    Game.UIMode.gameSave.BASE_fromJSON.call(this,json);
  }
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
          this.saveGame();
        }
      }
      else if ((inputData.key == 'l') || (inputData.key == 'L') && (inputData.shiftKey)) {
          this.restoreGame();
      }
      else if ((inputData.key == 'n') || (inputData.key == 'N') && (inputData.shiftKey)) {
          this.newGame();
      }
      else if ((inputData.key == 'r') || (inputData.key == 'R') && (inputData.shiftKey)) {
          Game.switchUIMode(Game.UIMode.gamePlay);
      }

    },

    saveGame: function (json_state_data) {
    if (this.localStorageAvailable()) {
      window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game._game)); // .toJSON()
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  restoreGame: function () {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);
      Game.setRandomSeed(state_data._randomSeed);
      Game.UIMode.gamePlay.setupPlay(state_data);
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  newGame: function (){
    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupPlay();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  BASE_toJSON: function(state_hash_name) {
    var state = this.attr;
    if (state_hash_name) {
      state = this[state_hash_name];
    }
    var json = {};
    for (var at in state) {
      if (state.hasOwnProperty(at)) {
        if (state[at] instanceof Object && 'toJSON' in state[at]) {
          json[at] = state[at].toJSON();
        } else {
          json[at] = state[at];
        }
      }
    }
    return json;
  },
  BASE_fromJSON: function (json,state_hash_name) {
    var using_state_hash = 'attr';
    if (state_hash_name) {
      using_state_hash = state_hash_name;
    }
    for (var at in this[using_state_hash]) {
      if (this[using_state_hash].hasOwnProperty(at)) {
        if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
          this[using_state_hash][at].fromJSON(json[at]);
        } else {
          this[using_state_hash][at] = json[at];
        }
      }
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
},

Game.UIMode.gameOptions = {
  enter: function(){
    console.log("entered options mode");
  },
  exit: function(){
    console.log("exiting options mode");
  },
  render: function(display){
    console.log("rendered options mode");
    display.drawText(5,1,"Key Bindings");
    display.drawText(1,1,"up: "+Game.keyBinding._curKeys["up"]);
  },
  handleInput: function(inputType, inputData){
    console.log("handling input in game options");
    Game.Message.clear();
    if (inputType == 'keypress') {
      Game.keyBinding.setKey("up", inputData);
    }
  }
}
