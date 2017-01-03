console.log("game.js loaded");

window.onload = function(){
  console.log("starting WSRL - window loaded");
  // check if rot.js can work on the browser
  if(!ROT.isSupported()){
    alert("the rot.js library isn't supported by your browser");
  }else{
    //initialize the game
    Game.init();

    document.getElementById('mh-main-display').appendChild(
      Game.display.main.o.getContainer());
  }
};

var Game = {
  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    }
  },
  init: function(){
    console.log("game initialized");
    this.display.main.o = new ROT.Display(
      {width: this.display.main.w,
       height: this.display.main.h}
    );

    for (var i = 0; i < Game.display.h; i++){
      for ( var j = 0; j < Game.display.w; j++){
        this.display.main.o.draw(6,6,"@", "#Of0");
      }
    }
  }
};
