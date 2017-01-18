Game.Room = function(roomTileSetName, pos, map){
  info = Game.RoomTileSets[roomTileSetName].getRoomInfo();

  this.attr = {
    _tiles: info.tiles,
    _x: pos.x,
    _y: pos.y,
    _map: map || null,
    //_blocks: info.blocks || null,
    _block_dim: info.block_dim,//for of {width: _ height: _}
    _width: info.width,
    _height: info.height
  }
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

Game.Room.prototype.getBlock = function(x, y){
  return this._attr._blocks[x][y];
};

Game.Room.prototype.getTiles = function(){
  return this.attr._tiles;
};

/*
Game.Room.prototype.setBlock = function(block, x, y){
  this._attr._blocks[x][y] = block;
};
*/

Game.Room.prototype.contains = function(pos){
  var thispos = this.getPos();
  return pos.x >= thispos.x && pos.x <= thispos.x + this.getWidth() &&
  pos.y >= thispos.y && pos.y <= thispos.y + this.getHeight();
};

Game.Room.prototype.surrounds = function(pos){
  var thispos = this.getPos();
  return pos.x >= (thispos.x-1) && pos.x <= (thispos.x + this.getWidth() + 1) &&
  pos.y >= (thispos.y-1) && pos.y <= (thispos.y + this.getHeight() + 1);
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

//this is where the tiles are drawn onto the map
//this will be much more complicated with entities
//so remember to do that later
//entries are the xy position in the blocks array
//this is f'ing gross
Game.Room.prototype.swap = function(entry1, entry2){
  var placeHolder = this.getBlock(entry1.x, entry1.y);
  this.setBlock(this.getBlock(entry2.x, entry2.y), entry1.x, entry1.y);
  this.setBlock(placeHolder, entry2.x, entry2.y);
  var fb = this.getBlock(entry2.x, entry2.y);
  this.attr._map.setArray(fb.getTiles(), this.getPos().x+fb.getPos().x, this.getPos().y+fb.getPos().y);
  var sb = this.getBlock(entry1.x, entry1.y)
  this.attr._map.setArray(sb.getTiles(), this.getPos().x+sb.getPos().x, this.getPos().y+sb.getPos().y);

  //handle entities here
};



Game.Room.prototype.getRandomLocation = function(filter_func){
  if (filter_func === undefined) {
    filter_func = function(tile) { return true; };
  }
  var tX,tY,t;
  do {
    tX = Game.util.randomInt(0,this.attr._width - 1);
    tY = Game.util.randomInt(0,this.attr._height - 1);
    t = this.attr._map.getTile(tX,tY);
  } while (! filter_func(t));
  return {x:tX,y:tY};
};

Game.Room.prototype.getRandomWalkableLocation = function (entity) {
  return this.getRandomLocation(function(t){ return t.isWalkable(); });
};
