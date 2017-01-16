Game.Block = function(properties){
  properties = properties || {};
  attr = {
    _tiles: properties.tiles,
    _name: properties.name || "unknown",
    _swappable: properties.swappable || true,
    _x: properties.x, //these are the positions relative to the room
    _y: properties.y
  }
};

Game.Block.prototype.getTiles = function(){
  return this.attr._tiles;
};

Game.Block.prototype.getPos = function(){
  return {x: this.attr._x, y: this.attr._y};
};
