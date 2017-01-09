//the general plan I have is to use rot.js maps and embellish with added features
//consider randomizing start position + checking to make sure it is a valid position
//need to decide on a process to determine which features go where
Game.Map_Gen = {

//features are 2-d arrays on set features i.e. houses, temples and stuff
//which have to be exactly copied
//null tiles are ignored in the setting process
//potentially include requirements for placement as well somehow
  _features: {
    _test: Game.util.init2DArray(2,2,Game.Tile.testTile)
  },

  //problems here will be to set the feature in an apropriate position
  //probs need another method for that
  _setFeature: function(mapArray, featureArray, x, y){
    for(var i = 0; i < featureArray.length; i++){
      for(var j = 0; j < featureArray[0].length; j++){
        if(featureArray[i][j] !== Game.Tile.nullTile){
          mapArray[x+i][y+j] = featureArray[i][j];
        }
      }
    }
    return mapArray;
  },

  allBlank: function(width, height){
    return Game.util.init2DArray(width, height, Game.Tile.floorTile);
  },

  basicMap: function(width, height){
    var mapTiles = Game.util.init2DArray(width,height,Game.Tile.nullTile);
    var generator = new ROT.Map.Cellular(width,height);
    generator.randomize(0.5);

    // repeated cellular automata process
    var totalIterations = 3;
    for (var i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }

    // run again then update map
    generator.create(function(x,y,v) {
      if (v === 1) {
        mapTiles[x][y] = Game.Tile.floorTile;
      } else {
        mapTiles[x][y] = Game.Tile.wallTile;
      }
    });

    return this._setFeature(mapTiles, this._features._test, 0, 0);
  }
}
