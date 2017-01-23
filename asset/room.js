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
    _entitiesByLocation: {},
    _locationsByEntity: {},
    _itemsByLocation: {}
  }
  this.attr._block_x = this.attr._width/this.attr._block_dim.width;
  this.attr._block_y = this.attr._height/this.attr._block_dim.height;

};

//x and y must fall in the range
Game.Room.prototype.setFirstSelected = function(px, py){
  if(px>0 || px<=this.attr._block_x || py> 0 || py<=this.attr._block_y){
    console.dir(JSON.parse(JSON.stringify(this.getTiles())));
    if(this.attr._first_selected){
      Game.util.setColor(this.getBlock(this.attr._first_selected.x, this.attr._first_selected.y), Game.UIMode.DEFAULT_COLOR_BG);
    }

    Game.util.setColor(this.getBlock(px, py), '#222');
    this.attr._first_selected = {x: px, y:py};
    console.dir(JSON.parse(JSON.stringify(this.getTiles())));
    return true;
  }
  console.log("selected block not in range");
  return false;
};

Game.Room.prototype.setSecondSelected = function(px, py){
  if(px>0 || px<=this.attr._block_x || py> 0 || py<=this.attr._block_y){
    if(this.attr._second_selected){
      Game.util.setColor(this.getBlock(this.attr._second_selected.x, this.attr._second_selected.y), Game.UIMode.DEFAULT_COLOR_BG);
    }

    Game.util.setColor(this.getBlock(px, py), '#333');
    this.attr._second_selected = {x: px, y: py}
    return true;
  }
  return false;
};

Game.Room.prototype.getFirstSelected = function(){
  return this.attr._first_selected;
};

Game.Room.prototype.getSecondSelected = function(){
    return this.attr._second_selected;
};

Game.Room.prototype.clearSelected = function(){
  Game.util.setColor(this.getTiles(), Game.UIMode.DEFAULT_COLOR_BG);

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

Game.Room.prototype.contains = function(pos){
  var thispos = this.getPos();
  return pos.x >= thispos.x && pos.x < thispos.x + this.getWidth() &&
  pos.y >= thispos.y && pos.y < thispos.y + this.getHeight();
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

  this.clearSelected();
  this.getMap().setUpFov();
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

Game.Room.prototype.setArray = function(featureArray, x, y){
  for(var i = 0; i < featureArray.length; i++){
    for(var j = 0; j < featureArray[0].length; j++){
      console.dir(featureArray[i][j]);
      this.attr._tiles[x+i][y+j] = featureArray[i][j];
      if(this.getMap()){
        this.getMap().getTiles()[x+i+this.getPos().x][y+j+this.getPos().y] = featureArray[i][j];
      }
    }
  }
};
Game.Map.prototype.addEntity = function (ent,pos) {
  this.getMap().addEntity(ent, )
};

Game.Map.prototype.addItem = function (itm,pos) {
    var loc = pos.x+","+pos.y;
    if (! this.attr._itemsByLocation[loc]) {
      this.attr._itemsByLocation[loc] = [];
    }
    this.attr._itemsByLocation[loc].push(itm.getId());
};

Game.Room.prototype.updateEntityLocation = function (ent) {
  this.getMap().updateEntityLocation(ent);
  //console.log('updating position of '+ent.getName()+' ('+ent.getId()+')');
  var origLoc = this.attr._locationsByEntity[ent.getId()];
  if (origLoc) {
    this.attr._entitiesByLocation[origLoc] = undefined;
  }
  var pos = ent.getPos();
  this.attr._entitiesByLocation[pos.x+","+pos.y] = ent.getId();
  this.attr._locationsByEntity[ent.getId()] = pos.x+","+pos.y;
};

Game.Map.prototype.getEntity = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var entId = this.attr._entitiesByLocation[useX+','+useY];
  if (entId) { return Game.DATASTORE.ENTITY[entId]; }
  return  false;
};

Game.Map.prototype.getItems = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var itemIds = this.attr._itemsByLocation[useX+','+useY];
  if (itemIds) { return itemIds.map(function(iid) { return Game.DATASTORE.ITEM[iid]; }); }
  return  [];
};

Game.Room.prototype.extractEntity = function (ent) {
  this.attr._entitiesByLocation[ent.getX()+","+ent.getY()] = undefined;
  this.attr._locationsByEntity[ent.getId()] = undefined;
  this.getMap().extractEntity(ent);
  return ent;
};

Game.Room.prototype.extractEntityAt = function (x_or_pos,y) {
  var ent = this.getEntity(x_or_pos,y);
  if (ent) {
    this.attr._entitiesByLocation[ent.getX()+","+ent.getY()] = undefined;
    this.attr._locationsByEntity[ent.getId()] = undefined;
    this.getMap().extractEntityAt(x_or_pos, y);
  }
  return ent;
};

Game.Map.prototype.extractItemAt = function (itm_or_idx,x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var itemIds = this.attr._itemsByLocation[useX+','+useY];
  if (! itemIds) { return false; }

  var item = false, extractedId = '';
  if (Number.isInteger(itm_or_idx)) {
    extractedId = itemIds.splice(itm_or_idx,1);
    item = Game.DATASTORE.ITEM[extractedId];
  } else {
    var idToFind = itm_or_idx.getId();
    for (var i = 0; i < itemIds.length; i++) {
      if (idToFind === itemIds[i]) {
        extractedId = itemIds.splice(i,1);
        item = Game.DATASTORE.ITEM[extractedId];
        break;
      }
    }
  }
  return item;
};

Game.Map.prototype.toJSON = function () {
  var json = Game.UIMode.gameSave.BASE_toJSON.call(this);
  return json;
};
Game.Map.prototype.fromJSON = function (json) {
  Game.UIMode.gameSave.BASE_fromJSON.call(this,json);
};
