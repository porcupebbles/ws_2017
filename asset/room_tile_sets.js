Game.RoomTileSets = {

    TutorialRoom1: {
      _width: 9,
      _height: 9,
      getRoomInfo: function(){
        var blocdim = {width: 3, height: 3};
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
              roomTiles[i][j] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: Game.Tile.DEFAULT_COLOR_RoomWall, transparent: true});
            }
          }
        }

        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height};
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
        roomTiles = Game.util.setFeature(roomTiles, Game.util.wallBlock(2, 2), {x: 2, y: 12});
        var theitems = [{name:'rock', pos:{x:0, y:15}}];
        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height, items: theitems};
      }
    },
    TutorialRoom4: {
      _width: 9,
      _height: 9,
      getRoomInfo: function(){
        var blocdim = {width: 3, height: 3};
        var roomTiles = Game.util.init2DArray(this._width, this._height, Game.Tile.nullTile);
        for(var i = 0; i < this._width; i++){
          for(var j = 0; j < this._height; j++){
            roomTiles[i][j] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        }
        var creatures = [{name:'Weakened Cellar Troll', pos:{x:4, y:4}}];
        var theitems = [{name: 'healing potion', pos:{x:7, y:4}}];
        //theitems.push({name:'rock', pos:{x:0, y:0}});
        //the 2-d array here will get more complex
        return {block_dim: blocdim, tiles: roomTiles,
        width: this._width, height: this._height, enemies: creatures, items: theitems};
      }
    },
    TutorialRoom5: {
      _width: 32,//Game.util.randomInt(16, 50),
      _height: 20,//Game.util.randomInt(16, 35),
      getRoomInfo: function(){
        var blocdim = {width: 4, height: 4};
        var fullTiles = Game.util.init2DArray(this._width*2, this._height*2, Game.Tile.nullTile);
        var map = new ROT.Map.EllerMaze(fullTiles.length, fullTiles[0].length);
        map.create(function(x,y,v) {
          if (v === 1) {
            fullTiles[x][y] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: Game.Tile.DEFAULT_COLOR_RoomWall, transparent: true});
          } else {
            fullTiles[x][y] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        });

        var creatures = [];
        for(var i = 0; i < 10; i++){
          creatures.push({name: 'cave wyrm'});
        }
        for(var i = 0; i < 5; i++){
          creatures.push({name:'Cellar Troll'});
        }


        var theitems = [];
        var random = Game.util.randomInt(0, 4)
        if(random==0){
          theitems.push({name: 'healing potion'});
        }else if (random ==1){
          theitems.push({name: 'swedish meatballs'});
          theitems.push({name: 'mystery potion'});
        }else if(random == 2){
          theitems.push({name: 'swedish meatballs'});
        }else if(random == 3){
          theitems.push({name: 'swedish meatballs'});
          theitems.push({name: 'swedish meatballs'});
        }else{
          theitems.push({name: 'healing potion'});
          theitems.push({name: 'mystery potion'});
          theitems.push({name: 'rock'});
        }
        random = Game.util.randomInt(0, 5);
        switch(random){
          case 0:
          theitems.push({name: 'leather mail'});
          break;
          case 1:
          theitems.push({name: 'bucket helmet'});
          break;
          case 2:
          theitems.push({name: 'ring of protection'});
          break;
          case 3:
          theitems.push({name: 'pair of plate pants'});
          break;
          case 4:
          theitems.push({name: 'bucket helmet'});
          theitems.push({name: 'ring of protection'});
          break;
          default:
          theitems.push({name: 'leather mail'});
          theitems.push({name: 'pair of plate pants'});
          break;
        }
        random = Game.util.randomInt(0, 5);
        switch(random){
          case 0:
          theitems.push({name: 'rusty dagger'});
          break;
          case 1:
          theitems.push({name: 'Pugnacious Polearm'});
          break;
          case 2:
          theitems.push({name: 'Swell Sword'});
          break;
          case 3:
          theitems.push({name: 'Mace (*not* pepper)'});
          break;
          case 4:
          theitems.push({name: 'Mace (*not* pepper)'});
          theitems.push({name: 'rusty dagger'});
          break;
          default:
          theitems.push({name: 'Swell Sword'});
          theitems.push({name: 'rusty dagger'});
          break;
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
    },
    TutorialRoom6: {
      _width: 40,//Game.util.randomInt(16, 50),
      _height: 24,//Game.util.randomInt(16, 35),
      getRoomInfo: function(){
        var blocdim = {width: 5, height: 3};
        var fullTiles = Game.util.init2DArray(this._width*2, this._height*2, Game.Tile.nullTile);
        var map = new ROT.Map.EllerMaze(fullTiles.length, fullTiles[0].length);
        map.create(function(x,y,v) {
          if (v === 1) {
            fullTiles[x][y] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: Game.Tile.DEFAULT_COLOR_RoomWall, transparent: true});
          } else {
            fullTiles[x][y] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        });

        var creatures = [];
        for(var i = 0; i < 12; i++){
          creatures.push({name: 'cave wyrm'});
        }
        for(var i = 0; i < 7; i++){
          creatures.push({name:'Cellar Troll'});
        }



                var theitems = [];
                var random = Game.util.randomInt(0, 4)
                if(random==0){
                  theitems.push({name: 'healing potion'});
                }else if (random ==1){
                  theitems.push({name: 'swedish meatballs'});
                  theitems.push({name: 'mystery potion'});
                }else if(random == 2){
                  theitems.push({name: 'swedish meatballs'});
                }else if(random == 3){
                  theitems.push({name: 'swedish meatballs'});
                  theitems.push({name: 'swedish meatballs'});
                  theitems.push({name: 'teleportation stone'});
                }else{
                  theitems.push({name: 'healing potion'});
                  theitems.push({name: 'mystery potion'});
                  theitems.push({name: 'rock'});
                }
                random = Game.util.randomInt(0, 5);
                switch(random){
                  case 0:
                  theitems.push({name: 'leather mail'});
                  break;
                  case 1:
                  theitems.push({name: 'bucket helmet'});
                  break;
                  case 2:
                  theitems.push({name: 'ring of protection'});
                  break;
                  case 3:
                  theitems.push({name: 'pair of plate pants'});
                  break;
                  case 4:
                  theitems.push({name: 'bucket helmet'});
                  theitems.push({name: 'ring of protection'});
                  break;
                  default:
                  theitems.push({name: 'leather mail'});
                  theitems.push({name: 'pair of plate pants'});
                  break;
                }
                random = Game.util.randomInt(0, 5);
                switch(random){
                  case 0:
                  theitems.push({name: 'rusty dagger'});
                  break;
                  case 1:
                  theitems.push({name: 'Pugnacious Polearm'});
                  break;
                  case 2:
                  theitems.push({name: 'Swell Sword'});
                  break;
                  case 3:
                  theitems.push({name: 'Mace (*not* pepper)'});
                  break;
                  case 4:
                  theitems.push({name: 'Mace (*not* pepper)'});
                  theitems.push({name: 'rusty dagger'});
                  break;
                  default:
                  theitems.push({name: 'Swell Sword'});
                  theitems.push({name: 'rusty dagger'});
                  break;
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
    },
    mazeRoom: {
      _width: 50,//Game.util.randomInt(16, 50),
      _height: 30,//Game.util.randomInt(16, 35),
      getRoomInfo: function(){
        // var xpossible = Game.util.divisors(this._width);
        // while(xpossible.length == 0){
        //   this._width = Game.util.randomInt(16, 50),
        //   xpossible = Game.util.divisors(this._width);
        // }
        // var ypossible = Game.util.divisors(this._height);
        // while(ypossible.length == 0){
        //   this._height = Game.util.randomInt(16, 35),
        //   ypossible = Game.util.divisors(this._height);
        // }
        // var blocdim = {width: xpossible[Game.util.randomInt(0, xpossible.length)], height: ypossible[Game.util.randomInt(0, ypossible.length)]};
        var blocdim = {width: 2, height: 5};
        var fullTiles = Game.util.init2DArray(this._width*2, this._height*2, Game.Tile.nullTile);
        var map = new ROT.Map.EllerMaze(fullTiles.length, fullTiles[0].length);
        map.create(function(x,y,v) {
          if (v === 1) {
            fullTiles[x][y] = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: Game.Tile.DEFAULT_COLOR_RoomWall, transparent: true});
          } else {
            fullTiles[x][y] = new Game.Tile({name:'floor', chr:' ', walkable:true, transparent: true});
          }
        });


        var creatures = [];
        for(var i = 0; i < 12; i++){
          creatures.push({name: 'cave wyrm'});
        }
        for(var i = 0; i < 8; i++){
          creatures.push({name:'Cellar Troll'});
        }
        for(var i = 0; i < 6; i++){
          creatures.push({name:'creepy wraith'});
        }



                var theitems = [];
                var random = Game.util.randomInt(0, 4)
                if(random==0){
                  theitems.push({name: 'healing potion'});
                }else if (random ==1){
                  theitems.push({name: 'swedish meatballs'});
                  theitems.push({name: 'mystery potion'});
                }else if(random == 2){
                  theitems.push({name: 'swedish meatballs'});
                }else if(random == 3){
                  theitems.push({name: 'swedish meatballs'});
                  theitems.push({name: 'swedish meatballs'});
                }else{
                  theitems.push({name: 'healing potion'});
                  theitems.push({name: 'mystery potion'});
                  theitems.push({name: 'rock'});
                }
                random = Game.util.randomInt(0, 5);
                switch(random){
                  case 0:
                  theitems.push({name: 'leather mail'});
                  break;
                  case 1:
                  theitems.push({name: 'bucket helmet'});
                  break;
                  case 2:
                  theitems.push({name: 'ring of protection'});
                  break;
                  case 3:
                  theitems.push({name: 'pair of plate pants'});
                  break;
                  case 4:
                  theitems.push({name: 'bucket helmet'});
                  theitems.push({name: 'ring of protection'});
                  break;
                  default:
                  theitems.push({name: 'leather mail'});
                  theitems.push({name: 'pair of plate pants'});
                  break;
                }
                random = Game.util.randomInt(0, 5);
                switch(random){
                  case 0:
                  theitems.push({name: 'rusty dagger'});
                  break;
                  case 1:
                  theitems.push({name: 'Pugnacious Polearm'});
                  break;
                  case 2:
                  theitems.push({name: 'Swell Sword'});
                  break;
                  case 3:
                  theitems.push({name: 'Mace (*not* pepper)'});
                  break;
                  case 4:
                  theitems.push({name: 'Mace (*not* pepper)'});
                  theitems.push({name: 'rusty dagger'});
                  break;
                  default:
                  theitems.push({name: 'Swell Sword'});
                  theitems.push({name: 'rusty dagger'});
                  break;
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
