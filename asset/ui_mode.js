Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

//used to hold all the save states
Game.UIMode.json_state_data = null;

Game.UIMode.gameStart = {
  enter: function(){
    Game.refresh();
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
    _avatarId: null,
    _inSwap: false,
    _inSecondSwap: false,

    //these are questionable
    _firstSwap_coords: null,
    _secondSwap_coords: null
  },
  enter: function(){
    if (this.attr._avatarId) {
      this.setCameraToAvatar();
    }
    Game.TimeEngine.unlock();
    Game.refresh();
  },
  exit: function(){
    Game.TimeEngine.lock();
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
  getCurrentRoom: function(){
    return this.getMap().getRoom(this.getAvatar().getPos());
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
    var seenCells = this.getAvatar().getVisibleCells();
    this.getMap().renderOn(display,this.attr._cameraX,this.attr._cameraY,{
      visibleCells:seenCells,
      maskedCells:this.getAvatar().getRememberedCoordsForMap()
      });
    this.getAvatar().rememberCoords(seenCells);
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg); // DEV
    display.drawText(1,4,"Turns: " + this.getAvatar().getTurns(),fg,bg);
    display.drawText(1,5,"HP: " + this.getAvatar().getCurHp(),fg,bg);
  },
  moveAvatar: function (pdx,pdy) {
    // console.log('moveAvatar '+pdx+','+pdy);
    var moveResp = this.getAvatar().raiseSymbolActiveEvent('adjacentMove',{dx:pdx,dy:pdy});
    // if (this.getAvatar().tryWalk(this.getMap(),dx,dy)) {
    if (moveResp.madeAdjacentMove && moveResp.madeAdjacentMove[0]) {
      this.setCameraToAvatar();
      return true;
    }
    return false;
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
        return this.handleKey(inputData);
      }
      return false;
    }
  },
  handleKey: function(inputData){
    var tookTurn = false;
    switch(inputData.key){
      //tookTurn =
      case Game.getKey("up"):
      tookTurn = this.handleDirectional(0, -1);
      break;
      case Game.getKey("left"):
      tookTurn = this.handleDirectional(-1, 0);
      break;
      case Game.getKey("down"):
      tookTurn = this.handleDirectional(0, 1);
      break;
      case Game.getKey('right'):
      tookTurn = this.handleDirectional(1, 0);
      break;
      case Game.getKey("save_screen"):
      Game.switchUIMode(Game.UIMode.gameSave);
      break;
      case Game.getKey("options"):
      Game.switchUIMode(Game.UIMode.gameOptions);
      break;
      case Game.getKey("swap"):
      if(this.getCurrentRoom()){
        if(this.attr._inSwap){
          this.attr._inSwap = false;
          this.getCurrentRoom().clearSelected();
          this.attr._inSecondSwap = false;
        }else{
          console.log("now in swap");
          this.attr._inSwap = true;

          this.attr._firstSwap_coords = this.getCurrentRoom().getGoodCoordinate();
          this.getCurrentRoom().setFirstSelected(this.attr._firstSwap_coords.x, this.attr._firstSwap_coords.y);
        }
      }else{
        Game.Message.send("not in a room, cannot swap");
      }
      break;
      case Game.getKey("swap_confirm"):
      if(this.attr._inSwap){
        if(this.attr._inSecondSwap){
          this.getCurrentRoom().swap(this.attr._firstSwap_coords, this.attr._secondSwap_coords);
          this.attr._inSwap = false;
          this.attr._inSecondSwap = false;
          //tookTurn = true;
        }else{
          this.attr._inSecondSwap = true;

          //improve on this
          this.attr._secondSwap_coords = this.getCurrentRoom().getGoodCoordinate();
          console.dir(this.attr._secondSwap_coords);

          ///bugged
          this.getCurrentRoom().setSecondSelected(this.attr._secondSwap_coords.x, this.attr._secondSwap_coords.y);
        }
      }else{
        console.log("not in swap. Cannot confirm");
      }
      break;
    }

    Game.refresh();

    if (tookTurn) {
      this.getAvatar().raiseSymbolActiveEvent('actionDone');
      return true;
    }
    return false;
  },

  handleDirectional(dx, dy){
    console.log("avatar");
    console.dir(this.getAvatar());
    if(this.attr._inSwap){
      if(this.attr._inSecondSwap){
        if(this.getCurrentRoom().setSecondSelected(this.attr._secondSwap_coords.x + dx, this.attr._secondSwap_coords.y + dy)){
          this.attr._secondSwap_coords = {x:this.attr._secondSwap_coords.x + dx, y: this.attr._secondSwap_coords.y +dy };
        }
      }else{
        if(this.getCurrentRoom().setFirstSelected(this.attr._firstSwap_coords.x + dx, this.attr._firstSwap_coords.y + dy)){
          this.attr._firstSwap_coords = {x:this.attr._firstSwap_coords.x + dx, y: this.attr._firstSwap_coords.y +dy };
        }
      }
      return false;
    }else{
      this.moveAvatar(dx,dy);
      return true;
    }
  },

  setupNewGame: function () {
    this.setMap('first', new Game.Map('rooms'));

    this.setAvatar(Game.EntityGenerator.create('avatar'));

    this.getMap().addEntity(this.getAvatar(),{x: 12, y: 5});
    this.setCameraToAvatar();
    this.getMap().addEntity(Game.EntityGenerator.create('newt'), {x:5, y:5});
    /*
    ////////////////////////////////////////////////////
    // dev code - just add some entities to the map
    var itemPos = '';
    for (var ecount = 0; ecount < 4; ecount++) {
      this.getMap().addEntity(Game.EntityGenerator.create('moss'),this.getMap().getRandomWalkableLocation());
      this.getMap().addEntity(Game.EntityGenerator.create('newt'),this.getMap().getRandomWalkableLocation());
      this.getMap().addEntity(Game.EntityGenerator.create('angry squirrel'),this.getMap().getRandomWalkableLocation());
      this.getMap().addEntity(Game.EntityGenerator.create('attack slug'),this.getMap().getRandomWalkableLocation());

      itemPos = this.getMap().getRandomWalkableLocation();
      this.getMap().addItem(Game.ItemGenerator.create('rock'),itemPos);
    }
    this.getMap().addItem(Game.ItemGenerator.create('rock'),itemPos);
    /*
    // dev code - just add some entities to the map
    for (var ecount = 0; ecount < 80; ecount++) {
      this.getMap().addEntity(Game.EntityGenerator.create('moss'),this.getMap().getRandomWalkableLocation());
    }
    */

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
      Game.TimeEngine.lock();
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
      Game.TimeEngine.lock();
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

      Game.DATASTORE.SCHEDULE = {};
      // NOTE: offsetting times by 1 so later restore can just drop them in and go
      Game.DATASTORE.SCHEDULE[Game.Scheduler._current.getId()] = 1;
      for (var i = 0; i < Game.Scheduler._queue._eventTimes.length; i++) {
        Game.DATASTORE.SCHEDULE[Game.Scheduler._queue._events[i].getId()] = Game.Scheduler._queue._eventTimes[i] + 1;
      }
      Game.DATASTORE.SCHEDULE_TIME = Game.Scheduler._queue.getTime() - 1; // offset by 1 so that when the engine is started after restore the queue state will match that as when it was saved

      window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game.DATASTORE));
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  restoreGame: function () {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);

      this._resetGameDataStructures();
//new stuff to inspect
      // game level stuff
      Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

      // maps
      for (var mapId in state_data.MAP) {
        if (state_data.MAP.hasOwnProperty(mapId)) {
          var mapAttr = JSON.parse(state_data.MAP[mapId]);
          Game.DATASTORE.MAP[mapId] = new Game.Map(mapAttr._mapTileSetName,mapId);
          Game.DATASTORE.MAP[mapId].fromJSON(state_data.MAP[mapId]);
        }
      }

      ROT.RNG.getUniform(); // once the map is regenerated cycle the RNG so we're getting new data for entity generation

      // entities
      for (var entityId in state_data.ENTITY) {
        if (state_data.ENTITY.hasOwnProperty(entityId)) {
          var entAttr = JSON.parse(state_data.ENTITY[entityId]);
          var newE = Game.EntityGenerator.create(entAttr._generator_template_key,entAttr._id);
          Game.DATASTORE.ENTITY[entityId] = newE;
          Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
        }
      }

      // items
      for (var itemId in state_data.ITEM) {
        if (state_data.ITEM.hasOwnProperty(itemId)) {
          var itemAttr = JSON.parse(state_data.ITEM[itemId]);
          var newI = Game.ItemGenerator.create(itemAttr._generator_template_key,itemAttr._id);
          Game.DATASTORE.ITEM[itemId] = newI;
          Game.DATASTORE.ITEM[itemId].fromJSON(state_data.ITEM[itemId]);
        }
      }

      // game play et al
      Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;
      Game.Message.attr = state_data.MESSAGES;

      //deal with key bindings later

      // schedule
      // NOTE: we need to initialize the timing engine a second time because as entities were restored above any active ones scheduled themselves automatically based on their base duration
      Game.initializeTimingEngine();
      for (var schedItemId in state_data.SCHEDULE) {
        if (state_data.SCHEDULE.hasOwnProperty(schedItemId)) {
          // check here to determine which data store thing will be added to the scheduler (and the actual addition may vary - e.g. not everyting will be a repeatable thing)
          if (Game.DATASTORE.ENTITY.hasOwnProperty(schedItemId)) {
            Game.Scheduler.add(Game.DATASTORE.ENTITY[schedItemId],true,state_data.SCHEDULE[schedItemId]);
          }
        }
      }
      Game.Scheduler._queue._time = state_data.SCHEDULE_TIME;

      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  newGame: function (){
    this._resetGameDataStructures();
    Game.initializeTimingEngine();
    Game.setRandomSeed(5 + Math.floor(Game.TRANSIENT_RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupNewGame();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  _resetGameDataStructures: function () {
    Game.DATASTORE = {};
    Game.DATASTORE.MAP = {};
    Game.DATASTORE.ENTITY = {};
    Game.DATASTORE.ITEM = {};
    Game.initializeTimingEngine();
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
