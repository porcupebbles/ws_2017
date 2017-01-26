Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#006600';//'#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#140d06'; //'#000';
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
    display.drawText(1,1,"%c{#000}.%c{}  _______    __  ____ ____       ___ ___  ____  ___________   ___ ____        ");
    display.drawText(1,2,"%c{#000}.%c{} / ___/  |__|  |/    |    \\     |   |   |/    |/ ___/      | /  _]    \\     ");
    display.drawText(1,3,"%c{#000}.%c{}(   \\_|  |  |  |  o  |  o  )    | _   _ |  o  (   \\_|      |/  [_|  D  )    ");
    display.drawText(1,4,"%c{#000}.%c{} \\__  |  |  |  |     |   _/     |  \\_/  |     |\\__  |_|  |_|    _]    /     ");
    display.drawText(1,5,"%c{#000}.%c{} /  \\ |  `  '  |  _  |  |       |   |   |  _  |/  \\ | |  | |   [_|    \\     ");
    display.drawText(1,6,"%c{#000}.%c{} \\    |\\      /|  |  |  |       |   |   |  |  |\\    | |  | |     |  .  \\    ");
    display.drawText(1,7,"%c{#000}.%c{}  \\___| \\_/\\_/ |__|__|__|       |___|___|__|__| \\___| |__| |_____|__|\\_|     ");
    display.drawText(15,9,"%c{#000}.%c{}    _______ __   ___ ____  ");
    display.drawText(15,10,"%c{#000}.%c{}   / ___/  |  | /  _]    \\ ");
    display.drawText(15,11,"%c{#000}.%c{}  (   \\_|  |  |/  [_|  _  |");
    display.drawText(15,12,"%c{#000}.%c{}   \\__  |  |  |    _]  |  |");
    display.drawText(15,13,"%c{#000}.%c{}   /  \\ |  :  |   [_|  |  |");
    display.drawText(15,14,"%c{#000}.%c{}   \\    |\\   /|     |  |  |");
    display.drawText(15,15,"%c{#000}.%c{}    \\___| \\_/ |_____|__|__|");






    display.drawText(8, 20, "press 'n' for a new game and 'l' to load an existing game");
    display.drawText(8, 21, "press ["+Game.getKey("help/options") + "] in-game for help and options");
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
    var curRoom = this.getCurrentRoom();
    if(curRoom && !curRoom.isVisited()){
      curRoom.setVisited(true);
      Game.Message.send(Game.Room_Messages[0]);
      Game.Room_Messages.splice(0, 1);
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
    return this.getMap().adjacentToRoom(this.getAvatar().getPos().x, this.getAvatar().getPos().y);
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
    display.drawText(1, 1,"Sven's Info", fg, bg);
    display.drawText(1,2,"Attack: " + this.getAvatar().getAttackDamage(),fg,bg);
    display.drawText(1,3,"HP: " + this.getAvatar().getCurHp(),fg,bg);

    //equippment stuff
    if(this.getAvatar().getEquippedWeapon()){
      display.drawText(1,4, "Equipped Weapon: " + this.getAvatar().getEquippedWeapon().getInfo(),fg,bg);
    }else{
      display.drawText(1,4, "Equipped Weapon: ---",fg,bg);
    }

    var the_items = this.getAvatar().getItems();
    for(var i = 0; i<4; i++){
      if(the_items[i]){
        display.drawText(1,5+i, "Item " + (i+1) + "[" + Game.getKey('item' + (i+1)) + "] : " + the_items[i].getInfo(),fg,bg);
      }else{
        display.drawText(1,5+i, "Item " + (i+1) + "[" + Game.getKey('item' + (i+1)) + "] : ---",fg,bg);
      }
    }
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
      // case Game.getKey("scroll_up"):
      // Game.Message.setDisplayedMessage(-1);
      // break;
      // case Game.getKey("scroll_down"):
      // Game.Message.setDisplayedMessage(1);
      // break;
      case Game.getKey("down_right"):
      tookTurn = this.handleDirectional(1, 1);
      break;
      case Game.getKey("down_left"):
      tookTurn = this.handleDirectional(-1, 1);
      break;
      case Game.getKey("up_right"):
      tookTurn = this.handleDirectional(1, -1);
      break;
      case Game.getKey("up_left"):
      tookTurn = this.handleDirectional(-1, -1);
      break;
      case Game.getKey("wait"):
      if(!this.attr._inSwap){
        tookTurn = true;
      }
      break;
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
      case Game.getKey('item1'):
      this.getAvatar().useItem(0);
      break;
      case Game.getKey('item2'):
      this.getAvatar().useItem(1);
      break;
      case Game.getKey('item3'):
      this.getAvatar().useItem(2);
      break;
      case Game.getKey('item4'):
      this.getAvatar().useItem(3);
      break;
      case Game.getKey("save_screen"):
      Game.switchUIMode(Game.UIMode.gameSave);
      break;
      case Game.getKey("help/options"):
      Game.switchUIMode(Game.UIMode.gameOptions);
      break;
      case Game.getKey("swap_initiate"):
      if(this.getCurrentRoom()){
        if(this.attr._inSwap){
          this.attr._inSwap = false;
          this.getCurrentRoom().clearSelected();
          this.attr._inSecondSwap = false;
        }else{
          this.getAvatar().setSwappable(false);
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
          tookTurn = true;
        }else{
          this.attr._inSecondSwap = true;

          //improve on this
          this.attr._secondSwap_coords = this.getCurrentRoom().getGoodCoordinate();

          ///bugged
          this.getCurrentRoom().setSecondSelected(this.attr._secondSwap_coords.x, this.attr._secondSwap_coords.y);
        }
      }else{
        Game.Message.send("Sven thinks you can't confirm a swap without starting one");
      }
      break;
    }

    Game.refresh();

    if (tookTurn) {
      this.getAvatar().raiseSymbolActiveEvent('actionDone');
      Game.Message.ageMessages();
      return true;
    }
    return false;
  },

  handleDirectional(dx, dy){
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

      //this is gross change if game is expanded upon
      var curRoom = this.getCurrentRoom();
      if(curRoom && !curRoom.isVisited()){
        curRoom.setVisited(true);
        Game.Message.send(Game.Room_Messages[0]);
        Game.Room_Messages.splice(0, 1);
      }
      return true;
    }
  },

  setupNewGame: function () {
    this.setMap('first', new Game.Map('Tutorial'));

    this.setAvatar(Game.EntityGenerator.create('avatar'));

    this.getMap().addEntity(this.getAvatar(),{x: 4, y: 4});
    this.setCameraToAvatar();
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
      display.drawText(10,8,"%c{#000}.%c{} __ __  ___  __ __      __    __ ____ ____  ");
      display.drawText(10,9,"%c{#000}.%c{}|  |  |/   \\|  |  |    |  |__|  |    |    \\ ");
      display.drawText(10,10,"%c{#000}.%c{}|  |  |     |  |  |    |  |  |  ||  ||  _  |");
      display.drawText(10,11,"%c{#000}.%c{}|  ~  |  O  |  |  |    |  |  |  ||  ||  |  |");
      display.drawText(10,12,"%c{#000}.%c{}|___, |     |  :  |    |  `  '  ||  ||  |  |");
      display.drawText(10,13,"%c{#000}.%c{}|     |     |     |     \\      / |  ||  |  |");
      display.drawText(10,14,"%c{#000}.%c{}|____/ \\___/ \\__,_|      \\_/\\_/ |____|__|__|  at least this level...");
      display.drawText(10, 20, "press 'n' for a new game and 'l' to load an existing game");
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

Game.UIMode.gameLose = {
    enter: function(){
      Game.TimeEngine.lock();
      Game.Message.clear();
      Game.refresh();
    },
    exit: function(){
    },
    render: function(display){
      display.clear();
      display.drawText(10,7,"%c{#000}.%c{}  ____  ____ ___ ___   ___       ___  __ __   ___ ____  __ ");
      display.drawText(10,8,"%c{#000}.%c{} /    |/    |   |   | /  _]     /   \\|  |  | /  _]    \\|  |");
      display.drawText(10,9,"%c{#000}.%c{}|   __|  o  | _   _ |/  [_     |     |  |  |/  [_|  D  )  |");
      display.drawText(10,10,"%c{#000}.%c{}|  |  |     |  \\_/  |    _]    |  O  |  |  |    _]    /|__|");
      display.drawText(10,11,"%c{#000}.%c{}|  |_ |  _  |   |   |   [_     |     |  :  |   [_|    \\ __ ");
      display.drawText(10,12,"%c{#000}.%c{}|     |  |  |   |   |     |    |     |\\   /|     |  .  \\  |");
      display.drawText(10,13,"%c{#000}.%c{}|___,_|__|__|___|___|_____|     \\___/  \\_/ |_____|__|\\_|__|");
      display.drawText(10, 20, "press 'n' for a new game and 'l' to load an existing game");
    },
    handleInput: function(inputType, inputData){
      Game.Message.clear();
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

    display.drawText(5,1, "Help (use [l] to exit)")



    display.drawText(5, 3, "A swap starts/stops by pressing your swap_initiate key. Pressing swap_confirm will give you a second block or confirm your swap. Be careful, Sven and some enemies cannot be swapped\n\nWeapons are %c{#b3ffb3}this color%c{} and must be equipped to use \n\n Armor is %c{#00664d}this color%c{} and is used passively \n\n Special Items are %c{#00e64d}this color%c{} and must be used to have an effect \n\n", 24);


    display.drawText(37,1,"Change Key Bindings (use [p] to scroll)");

    var key = null;
    var kb = Game.keyBinding.attr._curKeys;
    for(var i = 0; i<kb.length; i++){
      key=Game.keyBinding.attr._curKeys[i].label;
      if(key != kb[this.selected_function].label){
        if(kb[i].keyUsed == ' '){
          display.drawText(37,3+i,kb[i].label+": space");
        }else{
          display.drawText(37,3+i,kb[i].label+": "+kb[i].keyUsed);
        }
      }else{
        display.drawText(37,3+i,"%b{blue}"+kb[i].label+": "+kb[i].keyUsed);
      }
    }
  },
  handleInput: function(inputType, inputData){
    console.dir(inputData);
    var kb = Game.keyBinding.attr._curKeys;
    if (inputType == 'keypress') {
      //this would also be the place to exclude any other keys that shouldn't be
      //modified
      if(inputData.key == 'p'){
        if(this.selected_function+1 < kb.length){
          this.selected_function++;
        }else{
          this.selected_function=0;
        }
      }else if(inputData.key == 'l'){
        Game.switchUIMode(Game.UIMode.gamePlay);

      }else{
        Game.keyBinding.setKey(kb[this.selected_function].label, inputData.key);
      }
    }
    Game.refresh();
  }
}
