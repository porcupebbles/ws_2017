Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

//used to hold all the save states
Game.UIMode.json_state_data = null;

Game.UIMode.gameStart = {
  enter: function(){
    Game.refresh();
    console.dir(Game.getKey("up"));
  },
  exit: function(){
  },
  render: function(display){
    display.drawText(5,5,"Welcome");
    display.drawText(5, 6, "press 'n' for a new game and 'l' to load an existing game");
  },
  handleInput: function(inputType, inputData){
    if (inputType == 'keypress') {
      if (inputData.key == 'n') {
        Game.UIMode.gameSave.newGame();
      }
      else if (inputData.key == 'l') {
        Game.UIMode.gameSave.restoreGame();
      }
    }
  }
},

Game.UIMode.gamePlay = {
  JSON_KEY: 'uiMode_gamePlay',
  attr: {
    _mapId: '',
    _map_IDs:[],
    //{name:###, id:###} maybe add a last avatar position too based on gameplay
    _cameraX: 5,
    _cameraY: 5,
    _avatarId: null
  },
  enter: function(){
    if (this.attr._avatarId) {
      this.setCameraToAvatar();
    }
    Game.refresh();
  },
  exit: function(){
    Game.refresh();
  },
  //these two functions are pretty ugly, look into ways to improve
  //use ID get map
  getMap: function (the_name) {
    //console.log("got here");
    if(the_name){
      var match = this.attr._map_IDs.find('name', the_name);
      //console.dir(match);
      if(match){
        return Game.DATASTORE.MAP[match.id];
      }else{
        console.log("invalid map name");
        return null;
      }
    }else{
      return Game.DATASTORE.MAP[this.attr._mapId];
    }
  },
  setMap: function (the_name, map) {
    //maybe set camera to avatar here
    if(map){
      this.attr._map_IDs.push({name:the_name, id:map.getId()});
      this.attr._mapId = map.getId();
    }else{
      var match = this.attr._map_IDs.find('name', the_name);
      console.dir(match);
      if(match){
        this.attr._mapId = match.id;
      }else{
        console.log("invalid map name");
      }
    }
    //console.dir(this.attr._map_IDs);
  },
  getAvatar: function () {
    return Game.DATASTORE.ENTITY[this.attr._avatarId];
  },
  setAvatar: function (a) {
    this.attr._avatarId = a.getId();
  },
  render: function(display){
    this.getMap().renderOn(display,this.attr._cameraX,this.attr._cameraY);
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg); // DEV
    display.drawText(1,4,"Turns: " + this.getAvatar().getTurns(),fg,bg);
    display.drawText(1,5,"HP: " + this.getAvatar().getCurHp(),fg,bg);
  },
  moveAvatar: function (dx,dy) {
    if(this.getAvatar().tryWalk(this.getMap(), dx, dy)){
      this.setCameraToAvatar();
    }
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx,sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.getMap().getWidth());
    this.attr._cameraY = Math.min(Math.max(0,sy),this.getMap().getHeight());
    Game.refresh();
  },
  setCameraToAvatar: function () {
    this.setCamera(this.getAvatar().getX(),this.getAvatar().getY());
  },
  handleInput: function(inputType, inputData){
    //console.dir(inputType);
    //console.dir(inputData);
    if(inputType == 'keypress'){
      this.handleKey(inputData);
    }else if(inputType == 'keydown'){
      var handle = false;
      switch(inputData.key){
        case 'ArrowLeft': handle = true; break;
        case 'ArrowRight': handle = true; break;
        case 'ArrowUp': handle = true; break;
        case 'ArrowDown': handle = true; break;
        case 'Shift': handle = true; break;
        case 'Control': handle = true; break;
        case 'Alt': handle = true; break;
        case 'Shift': handle = true; break;
        case 'Meta': handle = true; break;
        case 'Backspace': handle = true; break;
      }
      if(handle){
        this.handleKey(inputData);
      }
    }
  },
  handleKey: function(inputData){
    switch(inputData.key){
      case Game.getKey("up"):
      Game.Message.send("a message");
      this.moveAvatar(0,-1);
      break;
      case Game.getKey("left"):
      this.moveAvatar(-1,0);
      break;
      case Game.getKey("down"):
      //this.setMap('first');
      this.moveAvatar(0,1);
      break;
      case Game.getKey('right'):
      /*
      if(!this.getMap('second')){
        this.setMap('second', new Game.Map('basicTunnel'));
      }else{
        this.setMap('second');
      }
      */
      this.moveAvatar(1,0);
      break;
      case Game.getKey("save_screen"):
      Game.switchUIMode(Game.UIMode.gameSave);
      break;
      case Game.getKey("options"):
      Game.switchUIMode(Game.UIMode.gameOptions);
      break;
    }
    Game.refresh();
  },

  setupNewGame: function () {
    this.setMap('first', new Game.Map('basicTunnel'));
    this.setAvatar(Game.EntityGenerator.create('avatar'));

    this.getMap().addEntity(this.getAvatar(),this.getMap().getRandomWalkableLocation());
    this.setCameraToAvatar();

    // dev code - just add some entities to the map
    for (var ecount = 0; ecount < 80; ecount++) {
      this.getMap().addEntity(Game.EntityGenerator.create('moss'),this.getMap().getRandomWalkableLocation());
    }

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
    },
    exit: function(){
    },
    render: function(display){
      display.drawText(5,5,"You Win");
    },
    handleInput: function(inputType, inputData){
    }
},

Game.UIMode.gameLose = {
    enter: function(){
      console.log("entered lose mode");
      Game.Message.clear();
      Game.refresh();
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
  RANDOM_SEED_KEY: 'gameRandomSeed',
    enter: function(){
      Game.refresh();
    },
    exit: function(){
      Game.refresh();
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
      Game.DATASTORE.GAME_PLAY = Game.UIMode.gamePlay.attr;
      Game.DATASTORE.MESSAGES = Game.Message.attr;
      window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.DATASTORE));
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  restoreGame: function () {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);

//new stuff to inspect
      // game level stuff
      Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

      // maps
      for (var mapId in state_data.MAP) {
        if (state_data.MAP.hasOwnProperty(mapId)) {
          var mapAttr = JSON.parse(state_data.MAP[mapId]);
          Game.DATASTORE.MAP[mapId] = new Game.Map(mapAttr._mapTileSetName);
          Game.DATASTORE.MAP[mapId].fromJSON(state_data.MAP[mapId]);
        }
      }

      // entities
      for (var entityId in state_data.ENTITY) {
        if (state_data.ENTITY.hasOwnProperty(entityId)) {
          var entAttr = JSON.parse(state_data.ENTITY[entityId]);
          Game.DATASTORE.ENTITY[entityId] = Game.EntityGenerator.create(entAttr._generator_template_key);
          Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
        }
      }

      // game play
      Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;

      //messages
      Game.Message.attr = state_data.MESSAGES;

      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  newGame: function (){
    Game.setRandomSeed(5 + Math.floor(Game.TRANSIENT_RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupNewGame();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  BASE_toJSON: function(state_hash_name) {
    var state = this.attr;
    if (state_hash_name) {
      state = this[state_hash_name];
    }
    var json = JSON.stringify(state);
    return json;
  },
  BASE_fromJSON: function (json,state_hash_name) {
    var using_state_hash = 'attr';
    if (state_hash_name) {
      using_state_hash = state_hash_name;
    }
    this[using_state_hash] = JSON.parse(json);
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
  selected_function: 0,

  enter: function(){
    Game.getDisplay('main').clear();
    //Game.Message.clear();
    this.selected_function=0,
    Game.refresh();
  },
  exit: function(){
  },
  render: function(display){
//update this later
    Game.getDisplay('main').clear(); //this could probably be handled more nicely

    display.drawText(1,1,"Key Bindings (use tab to scroll)");

    var key = null;
    var kb = Game.keyBinding.attr._curKeys;
    for(var i = 0; i<kb.length; i++){
      key=Game.keyBinding.attr._curKeys[i].label;
      if(key != kb[this.selected_function].label){
        display.drawText(1,2+i,kb[i].label+": "+kb[i].keyUsed);
      }else{
        display.drawText(1,2+i,"%b{blue}"+kb[i].label+": "+kb[i].keyUsed);
      }
    }
  },
  handleInput: function(inputType, inputData){
    var kb = Game.keyBinding.attr._curKeys;
    if (inputType == 'keypress') {
      //this would also be the place to exclude any other keys that shouldn't be
      //modified
      if(inputData.key == ' '){
        if(this.selected_function+1 < kb.length){
          this.selected_function++;
        }else{
          this.selected_function=0;
        }
      }else{
        Game.keyBinding.setKey(kb[this.selected_function].label, inputData.key);
      }
    }
    Game.refresh();
  }
}
