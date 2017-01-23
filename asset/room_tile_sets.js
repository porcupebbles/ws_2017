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
    }


}
