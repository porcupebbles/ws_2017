Game.RoomTileSets = {

    blockTemplates: {
      one: Game.util.init2DArray(4, 4, Game.Tile.wallTile)
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
    }
}
