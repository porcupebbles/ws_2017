Game.Room = function(roomTileSetName, pos, map){
  info = Game.RoomTileSets[roomTileSetName].getRoomInfo();
  this.attr = {
    _tiles: info.tiles,
    _x: pos.x,
    _y: pos.y,
    _map: map || null,
    _block_dim: info.block_dim,//for of {width: _ height: _}
    _width: info.width,
    _height: info.height,
    _first_selected: null,
    _second_selected: null,
    _enemies: info.enemies || [],
    _items: info.items || []
  }
  this.attr._block_x = this.attr._width/this.attr._block_dim.width;
  this.attr._block_y = this.attr._height/this.attr._block_dim.height;

};

Game.Room.prototype.getEnemies = function(){
  return this.attr._enemies;
};
Game.Room.prototype.getItems = function(){
  return this.attr._items;
};
//x and y must fall in the range
Game.Room.prototype.setFirstSelected = function(px, py){
  if(px<=0 || px>this.attr._block_x || py<= 0 || py>this.attr._block_y || this.containsSwappable(px, py)){
    console.log("selected block not in range");
    return false;
  }else{
    if(this.attr._first_selected){
      var info = this.getBlock(this.attr._first_selected.x, this.attr._first_selected.y);
      for(var i = 0; i<this.attr._block_dim.width; i++){
        for(var j = 0; j<this.attr._block_dim.height; j++){
          this.setTileBg(i+info.pos.x,j+info.pos.y, Game.UIMode.DEFAULT_COLOR_BG);
        }
      }
    }

    var info = this.getBlock(px, py);
    for(var i = 0; i<this.attr._block_dim.width; i++){
      for(var j = 0; j<this.attr._block_dim.height; j++){
        this.setTileBg(i+info.pos.x, j+info.pos.y, '#9966ff');
      }
    }
    this.attr._first_selected = {x: px, y:py};

    return true;
  }
};

Game.Room.prototype.setSecondSelected = function(px, py){
  if(px<=0 || px>this.attr._block_x || py<= 0 || py>this.attr._block_y || (px==this.attr._first_selected.x && py==this.attr._first_selected.y)|| this.containsSwappable(px, py)){
    console.log("selected block not in range");
    return false;
  }else{
    if(this.attr._second_selected){
      var info = this.getBlock(this.attr._second_selected.x, this.attr._second_selected.y);
      for(var i = 0; i<this.attr._block_dim.width; i++){
        for(var j = 0; j<this.attr._block_dim.height; j++){
          this.setTileBg(i+info.pos.x,j+info.pos.y, Game.UIMode.DEFAULT_COLOR_BG);
        }
      }
    }

    var info = this.getBlock(px, py);
    for(var i = 0; i<this.attr._block_dim.width; i++){
      for(var j = 0; j<this.attr._block_dim.height; j++){
        this.setTileBg(i+info.pos.x, j+info.pos.y, '#ff66cc');
      }
    }
    this.attr._second_selected = {x: px, y:py};

    return true;
  }
};

Game.Room.prototype.getFirstSelected = function(){
  return this.attr._first_selected;
};

Game.Room.prototype.getSecondSelected = function(){
    return this.attr._second_selected;
};

Game.Room.prototype.clearSelected = function(){
  var map = this.getMap();
  for(var i = 0; i<this.getWidth();i++){
    for(var j = 0; j<this.getHeight();j++){
      this.setTileBg(i, j, Game.UIMode.DEFAULT_COLOR_BG);
    }
  }

  this.attr._first_selected = null;
  this.attr._second_selected = null;
};

Game.Room.prototype.getBlockArray = function(){
  return {x: this.attr._block_x, y: this.attr._block_y};
};

Game.Room.prototype.getTiles = function(){
  return this.attr._tiles;
};

Game.Room.prototype.getMap = function(){
return this.attr._map;
};

Game.Room.prototype.setMap = function(map){
  this.attr._map = map;
};

Game.Room.prototype.getPos = function(){
  return {x: this.attr._x, y: this.attr._y};
};

Game.Room.prototype.getWidth = function(){
  return this.attr._width;
};

Game.Room.prototype.getHeight = function(){
  return this.attr._height;
};

//entries are the x,y on a grid of blocks, so they much be no greater
//than width/block_dim.x or y respectively
// the grid starts at 1 and not 0
//consider includes entities as well
Game.Room.prototype.getBlock = function(x, y){
  var theGrid = Game.util.init2DArray(this.attr._block_dim.width, this.attr._block_dim.height, Game.Tile.nullTile);
  var start_x = (x-1)*this.attr._block_dim.width;
  var start_y = (y-1)*this.attr._block_dim.height;
  for(var i = 0; i<this.attr._block_dim.width; i++){
    for( var j = 0; j<this.attr._block_dim.height; j++){
      theGrid[i][j] = this.getTiles()[i+start_x][j+start_y]
    }
  }
  return {tiles: theGrid, pos: {x: start_x, y: start_y}};
};

Game.Room.prototype.containsSwappable = function(x, y){
  var info = this.getBlock(x, y);
  var map = this.getMap();
  for(var i = 0; i < this.attr._block_dim.width; i++){
    for(var j = 0; j < this.attr._block_dim.height; j++){
      var ent = map.getEntity(info.pos.x+i+this.getPos().x, info.pos.y+j+this.getPos().y);
      if( ent && !ent.isSwappable()){
        return true;

      }
      //handle items as necessary
    }
  }
  return false;
};

Game.Room.prototype.contains = function(pos){
  var thispos = this.getPos();
  return pos.x >= thispos.x && pos.x < thispos.x + this.getWidth() &&
  pos.y >= thispos.y && pos.y < thispos.y + this.getHeight();
};

Game.Room.prototype.surrounds = function(pos){
  var thispos = this.getPos();
  return pos.x >= (thispos.x-1) && pos.x <= (thispos.x + this.getWidth()) &&
  pos.y >= (thispos.y-1) && pos.y <= (thispos.y + this.getHeight());
};

Game.Room.prototype.randomValidAdjacent = function(){
  var allAdjacent = [];
  for(var i = this.getPos().x; i < this.getPos().x + this.getWidth(); i++){
    allAdjacent.push({x: i, y: this.getPos().y - 1});
    allAdjacent.push({x: i, y: this.getPos().y + this.getHeight() + 1});
  }
  for(var i = this.getPos().y; i < this.getPos().y + this.getHeight(); i++){
    allAdjacent.push({x: this.getPos().x-1, y: i});
    allAdjacent.push({x: this.getPos().x + this.getWidth() + 1, y: i});
  }
  var theOne = allAdjacent[Game.util.randomInt(0, allAdjacent.length)];

};

//entries are the x,y on a grid of blocks, so they much be no greater
//than width/block_dim.x or y respectively
// entry = {x:_, y:_}
Game.Room.prototype.swap = function(entry1, entry2){
  var block1 = this.getBlock(entry1.x, entry1.y);
  var block2 = this.getBlock(entry2.x, entry2.y);

  //this.getMap().setArray(block1.tiles, block2.pos.x + this.attr._x, block2.pos.y + this.attr._y);
  this.setArray(block1.tiles, block2.pos.x, block2.pos.y);
  //this.getMap().setArray(block2.tiles, block1.pos.x + this.attr._x, block1.pos.y + this.attr._y);
  this.setArray(block2.tiles, block1.pos.x, block1.pos.y);


  //handle entities here
  var cy1 = (entry1.y - 1)*this.attr._block_dim.height + this.getPos().y;
  var cx1 = (entry1.x - 1)*this.attr._block_dim.width + this.getPos().x;
  var cy2 = (entry2.y - 1)*this.attr._block_dim.height + this.getPos().y;
  var cx2 = (entry2.x - 1)*this.attr._block_dim.width + this.getPos().x;

  Game.toReplace = {};

  var map = this.getMap();
  for(var i=0; i<this.attr._block_dim.width; i++){
    for(var j=0; j<this.attr._block_dim.height; j++){
      var ent1 = map.extractEntityAt({x:cx1 + i, y:cy1 + j});
      if(ent1){
        console.log("placed entity into toReplace");
        ent1.setBg(Game.UIMode.DEFAULT_COLOR_BG);
        Game.toReplace[ent1.getId()] = {entity: ent1, pos: {x:cx2 + i, y:cy2 + j}};
      }
      var ent2 = map.extractEntityAt({x:cx2 + i, y:cy2 + j});
      if(ent2){
        ent2.setBg(Game.UIMode.DEFAULT_COLOR_BG);
        Game.toReplace[ent2.getId()] = {entity: ent2, pos: {x:cx1 + i, y:cy1 + j}};
      }
      var items1 = map.getItems({x:cx1 + i, y:cy1 + j});
      for(var k = 0; k < items1.length; k++){
        var item1 = map.extractItemAt(items1[k],{x:cx1 + i, y:cy1 + j});
        if(item1){
          item1.setBg(Game.UIMode.DEFAULT_COLOR_BG);
          Game.toReplace[item1.getId()] = {item: item1, pos: {x:cx2 + i, y:cy2 + j}};
        }
      }
      var items2 = map.getItems({x:cx2 + i, y:cy2 + j});
      for(var k = 0; k<items2.length; k++){
        var item2 = map.extractItemAt(items2[k], {x:cx2 + i, y:cy2 + j});
        if(item2){
          item2.setBg(Game.UIMode.DEFAULT_COLOR_BG);
          Game.toReplace[item2.getId()] = {item: item2, pos: {x:cx1 + i, y:cy1 + j}};
        }
      }
      //handle items here too
    }
  }

  for(var id in Game.toReplace){
    var thing_pos = Game.toReplace[id];
    if(thing_pos.hasOwnProperty('entity')){
      map.addEntity(thing_pos.entity, thing_pos.pos);
    }else if(thing_pos.hasOwnProperty('item')){
      map.addItem(thing_pos.item, thing_pos.pos);
    }
  }



  //bugged
  this.clearSelected();

  this.getMap().setUpFov();
};

Game.Room.prototype.setTileBg = function(x, y, color){
  this.getTiles()[x][y].setBg(color);
  this.getMap().getTiles()[x+this.getPos().x][y+this.getPos().y].setBg(color);
  var ent = this.getMap().getEntity(x+this.getPos().x, y+this.getPos().y);
  if(ent){
    ent.setBg(color);
  }
  var items = this.getMap().getItems(x+this.getPos().x, y+this.getPos().y);
  for(var i = 0; i<items.length;i++){
    items[i].setBg(color);
  }
};

Game.Room.prototype.getGoodCoordinate = function(){
  for(var i = 1; i<=this.attr._block_x; i++){
    for( var j = 1; j<=this.attr._block_y; j++){
        if(!this.containsSwappable(i, j) && !this.coordsUsed(i, j)){
          return {x:i, y:j};
        }
    }
  }
  return null;
};

Game.Room.prototype.coordsUsed = function(x, y){
  if(this.attr._first_selected){
    return this.attr._first_selected.x == x && this.attr._first_selected.y == y;
  }else{
    return false;
  }
};

Game.Room.prototype.getTile = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  if ((useX < 0) || (useX >= this.attr._width) || (useY<0) || (useY >= this.attr._height)) {
    return Game.Tile.nullTile;
  }
  return this.attr._tiles[useX][useY] || Game.Tile.nullTile;
};

Game.Room.prototype.getRandomLocation = function(filter_func){
  if (filter_func === undefined) {
    filter_func = function(tile) { return true; };
  }
  var tX,tY,t;
  do {
    tX = Game.util.randomInt(0,this.attr._width - 1);
    tY = Game.util.randomInt(0,this.attr._height - 1);
    t = this.getTile(tX,tY);
  } while (! filter_func(t));
  return {x:tX,y:tY};
};

Game.Room.prototype.getRandomWalkableLocation = function (entity) {
  return this.getRandomLocation(function(t){ return t.isWalkable(); });
};

Game.Room.prototype.setArray = function(featureArray, x, y){
  for(var i = 0; i < featureArray.length; i++){
    for(var j = 0; j < featureArray[0].length; j++){
      this.attr._tiles[x+i][y+j] = featureArray[i][j];
      if(this.getMap()){
        this.getMap().getTiles()[x+i+this.getPos().x][y+j+this.getPos().y] = featureArray[i][j];
      }
    }
  }
};

Game.Map.prototype.toJSON = function () {
  var json = Game.UIMode.gameSave.BASE_toJSON.call(this);
  return json;
};
Game.Map.prototype.fromJSON = function (json) {
  Game.UIMode.gameSave.BASE_fromJSON.call(this,json);
};
