Game.MapTileSets = {

  //these might be used later to build different types of maps
  /*
  _features: {
    _test: Game.util.init2DArray(2,2,Game.Tile.testTile)
  },

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
  */

  caves1: {
    _width: 300,
    _height: 200,
    getMapTiles: function () {
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height);
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

      return mapTiles;
    }
  }
};
