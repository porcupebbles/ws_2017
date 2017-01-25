Game.RoomTileSets = {

    TutorialRoom1: {
      _width: 8,
      _height: 8,
      getRoomInfo: function(){
        var blocdim = {width: 2, height: 2};
        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);
        for(var i = 0; i < this._width; i++){
          for(var j = 0; j < this._height; j++){
            roomTiles[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        }
        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height};
      }
    },
    TutorialRoom2: {
      _width: 16,
      _height: 16,
      getRoomInfo: function(){
        var blocdim = {width: this._width/2, height: this._height/2};
        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);
        for(var i = 0; i < this._width; i++){
          for(var j = 0; j < this._height; j++){
            if(i < (this._width/2) && j < (this._height/2 )){
              roomTiles[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
            }else if(i >= this._width/2 && j >= (this._height/2)){
              roomTiles[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
            }else{
              roomTiles[i][j] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: '#5c8a8a', transparent: true});
            }
          }
        }

        var creatures = [];
        for(var i = 0; i < 10; i++){
          creatures.push({name: 'cave wyrm'});
        }

        var theitems = [];
        for(var i = 0; i <5; i++){
          theitems.push({name:'rock'});
          theitems.push({name: 'rusty dagger'});
          theitems.push({name: 'leather cuirass'});
        }

        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height, items: theitems, enemies: creatures};
      }
    },
    TutorialRoom3: {
      _width: 16,
      _height: 16,
      getRoomInfo: function(){
        var blocdim = {width: 2, height: 2};
        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);
        for(var i = 0; i < this._width; i++){
          for(var j = 0; j < this._height; j++){
              roomTiles[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        }

        //fix this part later
        for(var i = 0; i < this._width; i = i + 2){
          for(var j = 0; j < this._height; j = j + 2){
            if((i%4 == 0 && j%4 == 0) || ((i-2)%4 == 0 && (j-2)%4 == 0)){
              roomTiles = Game.util.setFeature(roomTiles, Game.util.wallBlock(2, 2), {x: i, y: j});
            }
          }
        }
        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height};
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
            fullTiles[x][y] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: '#5c8a8a', transparent: true});
          } else {
            fullTiles[x][y] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        });

        var creatures = [];
        for(var i = 0; i < 10; i++){
          creatures.push({name: 'cave wyrm'});
        }

        var theitems = [];
        for(var i = 0; i < 10; i++){
          theitems.push({name: 'rock'});
        }

        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);

        var px = Game.util.randomInt(0, this._width);
        var py = Game.util.randomInt(0, this._height);

        for(var i = 0; i<this._width; i++){
          for(var j = 0; j<this._height; j++){
            roomTiles[i][j] = fullTiles[i+px][j+py];
          }
        }

        return {block_dim: blocdim, tiles: roomTiles, width: this._width, height: this._height, enemies: creatures, items: theitems};
      }
    }


}
