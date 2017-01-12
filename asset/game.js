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
          this.DATASTORE[Game.UIMode.gameSave.RANDOM_SEED_KEY] = this._randomSeed;
          ROT.RNG.setSeed(this._randomSeed);
        },

        getRandomSeed: function(){
          return this._randomSeed;
        },

        init: function() {
          this.game = this;
          this.TRANSIENT_RNG = ROT.RNG.clone();
          Game.setRandomSeed(5 + Math.floor(this.TRANSIENT_RNG.getUniform()*100000));
          console.log("using random seed "+this._randomSeed);

          for(var d_key in  this.display){
            this.display[d_key].o = new ROT.Display({width: this.display[d_key].w,
              height: this.display[d_key].h, spacing: Game._DISPLAY_SPACING});
            }

            this.renderAll();
          },

          getDisplay: function (displayId) {
            if (this.display.hasOwnProperty(displayId)) {
              return this.display[displayId].o;
            }
            return null;
          },

          getKey: function (label_name){
            var matches = Game.keyBinding._curKeys.filter(
              function(elt,idx,arr) { return elt.label === label_name; }
            );
            if(matches[0]){
              return matches[0].keyUsed;
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
            if (this._curUIMode !== null) {
              this._curUIMode.enter();
            }
            //render everything
            this.renderAll();
          }
/*
          toJSON: function() {
            var json = {};
            json._randomSeed = this._randomSeed;
            json[Game.UIMode.gamePlay.JSON_KEY] = Game.UIMode.gamePlay.toJSON();
            return json;
          }
          */
        };
