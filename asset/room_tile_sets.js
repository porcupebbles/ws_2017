Game.RoomTileSets = {

    blockTemplates: {
      one: Game.util.init2DArray(4, 4, Game.Tile.wallTile),
      two: Game.util.init2DArray(8, 8, Game.Tile.roomWall)
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

        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.RoomTileSets.blockTemplates.two, {x:0, y:0});
        roomTiles = Game.MapTileSets.setFeature(roomTiles, Game.RoomTileSets.blockTemplates.two, {x:8, y:8});

        return {block_dim: blocdim, tiles: roomTiles, width: this._width, height: this._height};
      }
    }
}
