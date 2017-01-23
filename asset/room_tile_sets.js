Game.RoomTileSets = {

    blockTemplates: {
      one: Game.util.thefunc(),
      two: Game.util.thefunx()
    },

    basicRoom: {
      _width: 16,
      _height: 16,
      getRoomInfo: function(){
        var blocdim = {width: 4, height: 4};
        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: Game.util.init2DArray(this._width, this._height, Game.Tile.roomFloor),
        width: this._width, height: this._height};
      }
    },

    diagonalRoom: {
      _width:16,
      _height: 16,
      getRoomInfo: function(){
        var blocdim = {width: 8, height: 8};
        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.roomFloor);

        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.util.thefunc(), {x:0, y:0});
        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.util.thefunc(), {x:8, y:8});
        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.util.thefunx(), {x:0, y:8});
        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.util.thefunx(), {x:8, y:0});

        return {block_dim: blocdim, tiles: roomTiles, width: this._width, height: this._height};
      }
    },

    mazeRoom: {
      _width: Game.util.randomInt(16, 50),
      _height: Game.util.randomInt(16, 35),
      getRoomInfo: function(){
        var xpossible = Game.util.divisors(this._width);
        while(xpossible.length == 0){
          this._width = Game.util.randomInt(16, 50),
          xpossible = Game.util.divisors(this._width);
        }
        var ypossible = Game.util.divisors(this._height);
        while(ypossible.length == 0){
          this._height = Game.util.randomInt(16, 35),
          ypossible = Game.util.divisors(this._height);
        }
        var blocdim = {width: xpossible[Game.util.randomInt(0, xpossible.length)], height: ypossible[Game.util.randomInt(0, ypossible.length)]};
        var fullTiles = Game.util.init2DArray(this._width*2, this._height*2, Game.Tile.nullTile);
        var map = new ROT.Map.EllerMaze(fullTiles.length, fullTiles[0].length);
        map.create(function(x,y,v) {
          if (v === 1) {
            fullTiles[x][y] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: '#605db1', transparent: true});
          } else {
            fullTiles[x][y] = new Game.Tile({name:'floor', chr:'.', walkable:true, transparent: true});
          }
        });

        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);

        var px = Game.util.randomInt(0, this._width);
        var py = Game.util.randomInt(0, this._height);

        for(var i = 0; i<this._width; i++){
          for(var j = 0; j<this._height; j++){
            roomTiles[i][j] = fullTiles[i+px][j+py];
          }
        }

        return {block_dim: blocdim, tiles: roomTiles, width: this._width, height: this._height};
      }
    }


}
