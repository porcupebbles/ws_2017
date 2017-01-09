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

  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    },
    message: {
      w: 100,
      h: 5,
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
    ROT.RNG.setSeed(this._randomSeed);
  },

  getRandomSeed: function(){
    return this._randomSeed;
  },

  init: function() {
    this.game = this;

      this.setRandomSeed(5 + Math.floor(Math.random()*100000));
      console.log("using random seed "+this._randomSeed);

      for(var d_key in  this.display){
        this.display[d_key].o = new ROT.Display({width: this.display[d_key].w,
          height: this.display[d_key].h, spacing: Game._DISPLAY_SPACING});
      }

      console.dir(this.display);

      this.renderAll();
    },

    getDisplay: function (displayId) {
      if (this.display.hasOwnProperty(displayId)) {
        return this.display[displayId].o;
      }
      return null;
    },

    refresh: function(){
      this.renderAll();
    },

    renderMain: function() {
      if(this._curUIMode){
        this._curUIMode.render(this.getDisplay("main"));
      }
    },

    renderAvatar: function(){
      /*
      if(this._curUIMode){
        var d = this.getDisplay("avatar");
        Game._curUIMode.renderAvatarInfo(d);
      }
      */
      var d = this.getDisplay("avatar");
      d.drawText(2, 2, "Avatar Info");
    },

    renderMessage: function(){
      Game.Message.render(this.display.message.o);
    },

    renderAll: function(){
      this.renderAvatar();
      this.renderMain();
      this.renderMessage();
    },

    switchUIMode: function(newMode){
      //handle exit from old mode
      if(this._curUIMode !== null){
        this._curUIMode.exit();
      }
      // set current to new mode
      this._curUIMode = newMode;
      // enter new mode
      this._curUIMode.enter();
      //render everything
      this.renderAll();
    },

    toJSON: function() {
      var json = {"_randomSeed":this._randomSeed};
      return json;
    }
  };
