Game.MapTileSets = {

  //these might be used later to build different types of maps
  /*
  _features: {
    _test: Game.util.init2DArray(2,2,Game.Tile.testTile)
  },
  */
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

  caves1: {
    _width: 50,
    _height: 50,
    getMapInfo: function () {
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.nullTile);
      console.dir(mapTiles);
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

console.dir({rooms: [], tiles: mapTiles});
      return {rooms: [], tiles: mapTiles}; //should also pass info about room location and
                                //block size
          //rooms will be an array of objects constaining the upperleft coordinate,
          //block dimensions, width and height, and a 2-d array of blocks (for blocks
          // with different properties)
          // so {coord: {x:_,y:_}, blockdim:{x:_, y:_}, blocks: 2-d array}
    }
  },

  justFloor: {
    _width: 50,
    _height: 50,
    getMapInfo: function () {
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.roomFloor);

/*
      var testRoom = new Game.Room('basicRoom', {x:2, y:2});

      for(var i = 0; i < testRoom.getWidth(); i++){
        for(var j = 0; j < testRoom.getHeight(); j++){
          this._tiles[x+i][y+j] = featureArray[i][j];
        }
      }
      */

      return {tiles: mapTiles};
    }
  },

  basicTunnel: {
    _width: 100,
    _height: 100,
    getMapInfo: function () {
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.wallTile);

      //list of all valid placements
      var valid_placements = [];
      for(var i = 0; i < this._width; i++){
        for(var j = 0; j < this._height; j++){
          valid_placements.push({x: i, y: j});
        }
      }

      //create rooms and tiles

      for(var i = 0; i<5 ; i++){

        var room_name = 'basicRoom';
        var placement = valid_placements[Game.util.randomInt(0, valid_placements.length)];

        var xLimit = (this._width - Game.RoomTileSets[room_name]._width);
        var yLimit = (this._height - Game.RoomTileSets[room_name]._height);

        console.dir(placement);
        while(   (placement.x > xLimit) || (placement.y > yLimit))
        {
          placement = valid_placements[Game.util.randomInt(0, valid_placements.length)];
        }
        var oneRoom = new Game.Room(room_name, placement);
        mapTiles = Game.MapTileSets.setFeature(mapTiles, oneRoom.getTiles(), oneRoom.getPos());

        valid_placements = valid_placements.filter(function(elt,idx,arr) {return !oneRoom.surrounds(elt); });
      }

      //will need to sort which directions work
      var random_dir = Game.util.randomInt(1, 4);
      switch (random_dir) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
      }



      //mapTiles = Game.MapTileSets.setFeature(mapTiles, oneRoom.getTiles(), oneRoom.getPos());
      return {tiles: mapTiles, rooms: oneRoom}; //will need to define the map the room is on
    }
  },

  rooms: {
    _width: 100,
    _height: 20,
    getMapInfo: function(){
      var mapTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.wallTile);

      var all_rooms = [];

      var room_name = 'diagonalRoom';
      var x_pos = 0;
      console.log("got here at least");
      for(var i = 0; i < 5; i++){
        //console.log(i, ".", 1)
        var room = new Game.Room(room_name, {x:x_pos, y:0});
        //console.dir(room);
        //console.log(i, ".", 2)
        all_rooms.push(room);
        mapTiles = Game.MapTileSets.setFeature(mapTiles, room.getTiles(), room.getPos());
        //console.log(i, ".", 3)
        if(i !== 4){
          mapTiles = Game.MapTileSets.setFeature(mapTiles, Game.util.init2DArray(2, 1, Game.Tile.hallTile), {x:x_pos+room.getWidth(), y: 5});
        }
        //console.log(i, ".", 4)
        x_pos = x_pos + room.getWidth() + 2;
      }

      return {tiles: mapTiles, rooms: all_rooms};
    }
  }
};
