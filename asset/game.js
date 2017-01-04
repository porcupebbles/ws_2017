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
  }
};

var Game = {
  
  _DISPLAY_SPACING: 1.1,
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

  init: function() {
      this._randomSeed = 5 + Math.floor(Math.random()*100000);
      //this._randomSeed = 76250;
      console.log("using random seed "+this._randomSeed);
      ROT.RNG.setSeed(this._randomSeed);

      for(var d_key in  this.display){
        this.display[d_key].o = new ROT.Display({width: this.display[d_key].w,
          height: this.display[d_key].h, spacing: Game._DISPLAY_SPACING});
      }

      console.dir(this.display);

      this.renderMain();
    },

    getDisplay: function (displayId) {
      if (this.display.hasOwnProperty(displayId)) {
        return this.display[displayId].o;
      }
      return null;
    },

    renderMain: function() {
      var d = this.display.main.o;
      for (var i = 0; i < 10; i++) {
        d.drawText(5,i+5,"hello world");
      }
    }
  };
