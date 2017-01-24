Game.Tile = function (properties) {
  properties = properties || {};
  Game.Symbol.call(this, properties);
  if (! ('attr' in this)) { this.attr = {}; }
  this.attr._name = properties.name || 'unknown';
  this.attr._walkable = properties.walkable || false;
  this.attr._hall = properties.hall || false;
  this.attr._room = properties.room || false;
  this.attr._transparent = properties.transparent || false;
  this.attr._opaque = (properties.opaque !== undefined) ? properties.opaque : (! this.attr._transparent);
  this.attr._transparent = ! this.attr._opaque;
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
Game.Tile.prototype.isOpaque = function() {
  return this.attr._opaque;
};
Game.Tile.prototype.isTransparant = function() {
  return this.attr._transparant;
};
//-----------------------------------------------------------------------------

Game.Tile.nullTile = new Game.Tile({name:'nullTile'});
Game.Tile.floorTile = new Game.Tile({name:'floor', chr:'.', walkable:true, transparent: true});
Game.Tile.wallTile = new Game.Tile({name:'wall',chr:'#', transparent: true});
Game.Tile.hallTile = new Game.Tile({name: 'hall', chr: ' ', hall: true , walkable: true, transparent: true});

Game.Tile.roomFloor = new Game.Tile({name: 'roomFloor', chr: '.', room: true, walkable: true, fg: '#605db1', transparent: true});
Game.Tile.roomWall = new Game.Tile({name: 'roomWall', chr:'#', room: true, fg: '#605db1', transparent: true});

Game.Tile.testTile = new Game.Tile({name:'test',chr:'M', walkable:true, transparent: true});
