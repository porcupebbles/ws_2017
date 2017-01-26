console.log("game.js loaded");

window.onload = function(){
  console.log("starting WSRL - window loaded");
  // check if rot.js can work on the browser
  if(!ROT.isSupported()){
    alert("the rot.js library isn't supported by your browser");
  }else{
  //initialize the game
  Game.init();

  document.getElementById('mh-avatar-display').appendChild(
    Game.getDisplay('avatar').getContainer());
  document.getElementById('mh-main-display').appendChild(
    Game.getDisplay('main').getContainer());
  document.getElementById('mh-message-display').appendChild(
    Game.getDisplay('message').getContainer());

  var bindEventToScreen = function(eventType) {
    window.addEventListener(eventType, function(evt) {
        Game.eventHandler(eventType, evt);
      });
  };
  // Bind keyboard input events
  bindEventToScreen('keypress');
  bindEventToScreen('keydown');

  Game.switchUIMode(Game.UIMode.gameStart)
  }
};

var Game = {
  _PERSISTANCE_NAMESPACE: 'wsrlgame',
  _randomSeed: 0,
  _DISPLAY_SPACING: 1.1,
  _curUIMode: null,
  game: null,
  TRANSIENT_RNG: null,
  DATASTORE:{},
  Scheduler: null,
  TimeEngine: null,

  messageCounters: {
    armor: 1,
    armor_loss: 1

  },

  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 40,
      h: 10,
      o: null
    },
    message: {
      w: 39,
      h: 10,
      o: null
    }
  },

  eventHandler: function(eventType, evt){
    if(this._curUIMode){
      this._curUIMode.handleInput(eventType, evt);
    }
  },

  setRandomSeed: function(s) {
    this._randomSeed = s;
    console.log("using random seed " + this._randomSeed);
    this.DATASTORE[Game.UIMode.gameSave.RANDOM_SEED_KEY] = this._randomSeed;
    ROT.RNG.setSeed(this._randomSeed);
  },

  getRandomSeed: function(){
    return this._randomSeed;
  },

  init: function() {
    console.log("works this much");
    this.game = this;
    this.TRANSIENT_RNG = ROT.RNG.clone();

    for(var d_key in  this.display){
      this.display[d_key].o = new ROT.Display({width: this.display[d_key].w,
        height: this.display[d_key].h, spacing: Game._DISPLAY_SPACING});
    }
    this.renderAll();
  },

  initializeTimingEngine: function () {
    // NOTE: single, central timing system for now - might have to refactor this later to deal with mutliple map stuff
    Game.Scheduler = new ROT.Scheduler.Action();
    Game.TimeEngine = new ROT.Engine(Game.Scheduler);
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  getKey: function (label_name){
    var theSet = Game.keyBinding.attr._curKeys.find("label", label_name);
    if(theSet){
      return theSet.keyUsed;
    }
    return null;
  },

  refresh: function(){
    this.renderAll();
  },

  renderMain: function() {
    this.display.main.o.clear();
    if (this._curUIMode === null) {
      return;
    }
    if (this._curUIMode.hasOwnProperty('render')) {
      this._curUIMode.render(this.display.main.o);
    }
  },

  renderAvatar: function(){
    this.display.avatar.o.clear();
    if (this._curUIMode === null) {
      return;
    }
    if (this._curUIMode.hasOwnProperty('renderAvatarInfo')) {
      this._curUIMode.renderAvatarInfo(this.display.avatar.o);
    }
  },

  renderMessage: function(){
    Game.Message.render(this.display.message.o);
  },

  hideDisplayMessage: function() {
    this._display.message.o.clear();
  },

  renderAll: function(){
    this.renderAvatar();
    this.renderMain();
    this.renderMessage();
  },

  getAvatar: function () {
    return Game.UIMode.gamePlay.getAvatar();
  },
  getMap: function(){
    return Game.UIMode.gamePlay.getMap();
  },

  switchUIMode: function(newMode){
    //handle exit from old mode
    if(this._curUIMode !== null){
      this._curUIMode.exit();
    }
    // set current to new mode
    this._curUIMode = newMode;
    // enter new mode
    if (this._curUIMode !== null) {
      this._curUIMode.enter();
    }
    //render everything
    this.renderAll();
  },

  Room_Messages: ["Sven should have never should have gone exploring his basement...\nIf you help Sven escape, Sven would be most greatfull.\nSven can move horizontally and diagonally using your directional keys",

  "Sven, using the space key, can swap groups of tiles in a room and a swap can be cancelled the same way. Pressing shift will confirm the swap",

  "Some rooms have different magic fields and Sven will be able to move different amounts of blocks. I guess he isn't much of a master yet...",

  "There are some nasty monsters down in Sven's basement especially when you have wet-noodle arms like Sven. It's best to avoid confrontation or find weapons and armor",

  "Here's a real room. Sven hopes you get it cause it's his butt on the line",

  "Sven's heart is beating out of his chest. Sven can't wait to get out of this basement",

  "Sven thinks we're almost to the staircase. As long as there aren't tougher enemies, Sven thinks this will be easy"]

};
