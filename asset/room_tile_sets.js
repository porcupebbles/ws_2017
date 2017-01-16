Game.RoomTileSets = {

    blockTemplates = {
      one: Game.Util.init2DArray(4, 4, Game.Tile.wallTile)
    },

    basicRoom: {
      getRoomInfo: function(){
        var blocdim = {width: 4, height: 4};

        return {block_dim: blocdim, blocks: Game.Util.init2DArray(4, 4, this.blockTemplates.one)};
      }
    }
}
