Game.Tile = function (properties) {
  properties = properties || {};
  Game.Symbol.call(this, properties);
  if (! ('attr' in this)) { this.attr = {}; }
  this.attr._name = properties.name || 'unknown';
  this.attr._walkable = properties.walkable || false;
  this.attr._hall = properties.hall || false;
  this.attr._room = properties.room || false;
};
Game.Tile.extend(Game.Symbol);

Game.Tile.prototype.getSymbol = function () {
  return this.attr._sym;
};
Game.Tile.prototype.getName = function () {
  return this.attr._name;
};
Game.Tile.prototype.isWalkable = function () {
  return this.attr._walkable;
};
Game.Tile.prototype.isHall = function() {
  return this.attr._hall;
};
Game.Tile.prototype.isRoom = function() {
  return this.attr._room;
};
//-----------------------------------------------------------------------------

Game.Tile.nullTile = new Game.Tile({name:'nullTile'});
Game.Tile.floorTile = new Game.Tile({name:'floor', chr:'.', walkable:true});
Game.Tile.wallTile = new Game.Tile({name:'wall',chr:'#'});
Game.Tile.hallTile = new Game.Tile({name: 'hall', chr: '.', hall: true });

Game.Tile.roomFloor = new Game.Tile({name: 'roomFloor', chr: '.', room: true});
Game.Tile.roomWall = new Game.Tile({name: 'roomWall', chr:'#', room: true});

Game.Tile.testTile = new Game.Tile({name:'test',chr:'M', walkable:true});
