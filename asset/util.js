if (!String.prototype.startsWith) { // nabbed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

Game.util = {

  divisors: function(number){
    var divs = [];
    for(var i = 2; i < 10; i++){
      if(number % i == 0){
        divs.push(i);
      }
    }
    return divs;
  },
  randomString: function (len) {
    var charSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    var res='';
    for (var i=0; i<len; i++) {
        res += charSource.random();
    }
    return res;
  },

  ID_SEQUENCE: 0,

  uniqueId: function() {
     Game.util.ID_SEQUENCE++;
     return Date.now()+'-'+Game.util.ID_SEQUENCE+'-'+Game.util.randomString(24);
  },

  init2DArray: function (x,y,initVal) {
    var a = [];
    for (var xdim=0; xdim < x; xdim++) {
      a.push([]);
      for (var ydim=0; ydim < y; ydim++) {
        a[xdim].push(initVal);
      }
    }
    return a;
  },

  randomInt: function (min,max) {
    var range = max - min;
    var offset = Math.floor(ROT.RNG.getUniform()*(range+1));
    return offset+min;
  },

  positionsAdjacentTo: function (pos) {
    var adjPos = [];
    adjPos.push({x: pos.x+1, y: pos.y});
    adjPos.push({x: pos.x-1, y: pos.y});
    adjPos.push({x: pos.x, y: pos.y+1});
    adjPos.push({x: pos.x, y: pos.y-1});
    // for (var dx = -1; dx <= 1; dx++) {
    //   for (var dy = -1; dy <= 1; dy++) {
    //     if (dx !== 0 && dy !== 0) {
    //       adjPos.push({x:pos.x+dx,y:pos.y+dy});
    //     }
    //   }
    // }
    //
    return adjPos;
  },

  getDisplayDim: function (display) {
    return {w:display._options.width, h:display._options.height};
  },

  cdebug: function (a) {
    if (typeof a == 'object') {
      console.dir(JSON.parse(JSON.stringify(a)));
    } else {
      console.log(a);
    }
  },

  compactBooleanArray_or: function (ar) {
    if (! ar) { return false; }
    var ret = false;
    for (var i = 0; i < ar.length; i++) {
      ret = ret || ar[i];
    }
    return ret;
  },
  compactBooleanArray_and: function (ar) {
    if (! ar) { return false; }
    var ret = true;
    for (var i = 0; i < ar.length; i++) {
      ret = ret && ar[i];
    }
    return ret;
  },

  compactNumberArray_add: function (ar) {
    if (! ar) { return 0; }
    var ret = 0;
    for (var i = 0; i < ar.length; i++) {
      ret += ar[i];
    }
    return ret;
  },
  compactNumberArray_mult: function (ar) {
    if (! ar) { return 1; }
    var ret = 1;
    for (var i = 0; i < ar.length; i++) {
      ret *= ar[i];
    }
    return ret;
  },
  //it has to be an array of symbols
  // setColor: function(array, color){
  //   for(var i = 0; i<array.length; i++){
  //     for(var j = 0; j<array.length[0].length; j++){
  //       array[i][j] = array[i][j].setBg(color);
  //     }
  //   }
  // },

  //just for testing purposes at the moment
  wallBlock: function(x, y){
    var the = Game.util.init2DArray(x, y, Game.Tile.nullTile);
    for(var i = 0; i < the.length; i++){
      for(var j = 0; j < the[0].length; j++){
        the[i][j] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: Game.Tile.DEFAULT_COLOR_RoomWall, transparent: true});
      }
    }
    return the;
  },
  floorBlock: function(x, y){
    var the = Game.util.init2DArray(x, y, Game.Tile.nullTile);
    for(var i = 0; i < the.length; i++){
      for(var j = 0; j < the[0].length; j++){
        the[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
      }
    }
    return the;
  },
  setFeature: function(mapArray, featureArray, pos){
    for(var i = 0; i < featureArray.length; i++){
      for(var j = 0; j < featureArray[0].length; j++){
        if(featureArray[i][j] !== Game.Tile.nullTile){
          mapArray[pos.x+i][pos.y+j] = featureArray[i][j];
        }
      }
    }
    return mapArray;
  },
  //super simple at the moment could definitely improve on this
  calcBreak: function(dura){
    if(Game.util.randomInt(0, 2) == 1){
      Game.Message.send("Sven's Weapon has lost durability");
      return dura - 1;
    }else{
      return dura;
    }
  }
};

Game.PresetMessages = {
  armor_use: ["Sven wonders what you want him to do with this armor. Sven is already wearing it. What more do you want of Sven?",
  "Sven thinks armor is for wearing. Please enlighten Sven if you know something Sven doesn't", "Sven thinks you aren't that bright. Maybe next time Sven asks you to \"use\" your shirt. What does that mean? Sven doesn't know and Sven doesn't care",
  "Sven can't use Armor"],
  armor_loss: ["Sven is saddened by the loss of his armor"]
};
