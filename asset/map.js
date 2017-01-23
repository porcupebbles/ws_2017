Game.DATASTORE.MAP = {};

Game.Map = function (mapTileSetName, presetId) {
  info = Game.MapTileSets[mapTileSetName].getMapInfo();
  this._tiles = info.tiles;
  this.attr = {
    _width: this._tiles.length,
    _height: this._tiles[0].length,
    _id: presetId||Game.util.uniqueId(),
    _mapTileSetName: mapTileSetName,
    _entitiesByLocation: {},
    _locationsByEntity: {},
    _rooms: info.rooms || null,
    _itemsByLocation: {},
    _inRoom: info.inRoom || false
  };

  for(var i = 0; i < this.attr._rooms.length; i++){
    this.attr._rooms[i].setMap(this);
  }

  this._fov = null;
  this.setUpFov();

  Game.DATASTORE.MAP[this.attr._id] = this;
};

Game.Map.prototype.getTiles = function(){
  return this._tiles;
};

Game.Map.prototype.getInRoom = function(){
  return this.attr._inRoom;
};

Game.Map.prototype.setInRoom = function(state){
  this.attr._inRoom = state;
};

Game.Map.prototype.setUpFov = function () {
  var map = this;
  this._fov = new ROT.FOV.DiscreteShadowcasting(function(x, y) {
                    return !map.getTile(x, y).isOpaque();
                }, {topology: 8});
};

Game.Map.prototype.getFov = function () {
  return this._fov;
};

Game.Map.prototype.getRoom = function(pos){
  for(var i = 0; i < this.attr._rooms.length; i++){
    if(this.attr._rooms[i].contains(pos)){
      return this.attr._rooms[i];
    }
  }
  return null;
};

Game.Map.prototype.getRooms = function(){
  return this.attr._rooms;
};

Game.Map.prototype.getId = function () {
  return this.attr._id;
};

Game.Map.prototype.getWidth = function () {
  return this.attr._width;
};

Game.Map.prototype.getHeight = function () {
  return this.attr._height;
};

Game.Map.prototype.getTile = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  if ((useX < 0) || (useX >= this.attr._width) || (useY<0) || (useY >= this.attr._height)) {
    return Game.Tile.nullTile;
  }
  return this._tiles[useX][useY] || Game.Tile.nullTile;
};

Game.Map.prototype.addEntity = function (ent,pos) {
  this.attr._entitiesByLocation[pos.x+","+pos.y] = ent.getId();
  this.attr._locationsByEntity[ent.getId()] = pos.x+","+pos.y;
  ent.setMap(this);
  ent.setPos(pos);
};

Game.Map.prototype.addItem = function (itm,pos) {
    var loc = pos.x+","+pos.y;
    if (! this.attr._itemsByLocation[loc]) {
      this.attr._itemsByLocation[loc] = [];
    }
    this.attr._itemsByLocation[loc].push(itm.getId());
};

Game.Map.prototype.updateEntityLocation = function (ent) {
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

Game.Map.prototype.extractEntity = function (ent) {
  this.attr._entitiesByLocation[ent.getX()+","+ent.getY()] = undefined;
  this.attr._locationsByEntity[ent.getId()] = undefined;
  return ent;
};

Game.Map.prototype.extractEntityAt = function (x_or_pos,y) {
  var ent = this.getEntity(x_or_pos,y);
  if (ent) {
    this.attr._entitiesByLocation[ent.getX()+","+ent.getY()] = undefined;
    this.attr._locationsByEntity[ent.getId()] = undefined;
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

Game.Map.prototype.getRandomLocation = function(filter_func) {
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

Game.Map.prototype.getRandomWalkableLocation = function() {
  return this.getRandomLocation(function(t){ return t.isWalkable(); });
};

Game.Map.prototype.rememberCoords = function (toRemember) {
  for (var coord in toRemember) {
    if (toRemember.hasOwnProperty(coord)) {
      this.attr._rememberedCoords[coord] = true;
    }
  }
};

Game.Map.prototype.renderOn = function (display,camX,camY,renderOptions) { //visibleCells,showEntities,showTiles,maskRendered,memoryOnly) {
  var opt = renderOptions || {};

  var checkCellsVisible = opt.visibleCells !== undefined;
  var visibleCells = opt.visibleCells || {};
  var showVisibleEntities = (opt.showVisibleEntities !== undefined) ? opt.showVisibleEntities : true;
  var showVisibleItems = (opt.showVisibleItems !== undefined) ? opt.showVisibleItems : true;
  var showVisibleTiles = (opt.showVisibleTiles !== undefined) ? opt.showVisibleTiles : true;

  var checkCellsMasked = opt.maskedCells !== undefined;
  var maskedCells = opt.maskedCells || {};
  var showMaskedEntities = (opt.showMaskedEntities !== undefined) ? opt.showMaskedEntities : false;
  var showMaskedItems = (opt.showMaskedItems !== undefined) ? opt.showMaskedItems : false;
  var showMaskedTiles = (opt.showMaskedTiles !== undefined) ? opt.showMaskedTiles : true;


  if (! (showVisibleEntities || showVisibleTiles || showMaskedEntities || showMaskedTiles)) { return; }

  var dims = Game.util.getDisplayDim(display);
  var xStart = camX-Math.round(dims.w/2);
  var yStart = camY-Math.round(dims.h/2);
  for (var x = 0; x < dims.w; x++) {
    for (var y = 0; y < dims.h; y++) {
      var mapPos = {x:x+xStart,y:y+yStart};
      var mapCoord = mapPos.x+','+mapPos.y;

      if (! ((checkCellsVisible && visibleCells[mapCoord]) || (checkCellsMasked && maskedCells[mapCoord]))) {
        continue;
      }

      var tile = this.getTile(mapPos);
      if (tile.getName() == 'nullTile') {
        tile = Game.Tile.wallTile;
      }
      if (showVisibleTiles && visibleCells[mapCoord]) {
        tile.draw(display,x,y);
      } else if (showMaskedTiles && maskedCells[mapCoord]) {
        tile.draw(display,x,y,true);
      }

      var items = this.getItems(mapPos);
      if (items.length == 1) {
        if (showVisibleItems && visibleCells[mapCoord]) {
          items[0].draw(display,x,y);
        } else if (showMaskedItems && maskedCells[mapCoord]) {
          items[0].draw(display,x,y,true);
        }
      } else if (items.length > 1) {
        if (showVisibleItems && visibleCells[mapCoord]) {
          Game.Symbol.ITEM_PILE.draw(display,x,y);
        } else if (showMaskedItems && maskedCells[mapCoord]) {
          Game.Symbol.ITEM_PILE.draw(display,x,y,true);
        }
      }

      var ent = this.getEntity(mapPos);
      if (ent) {
        if (showVisibleEntities && visibleCells[mapCoord]) {
          ent.draw(display,x,y);
        } else if (showMaskedEntities && maskedCells[mapCoord]) {
          ent.draw(display,x,y,true);
        }
      }
    }
  }
};

Game.Map.prototype.renderFovOn = function (display,camX,camY,radius) {
  // console.log("display is ");
  // console.dir(display);
  var dims = Game.util.getDisplayDim(display);
  var xStart = camX-Math.round(dims.w/2);
  var yStart = camY-Math.round(dims.h/2);

  // track fov visibility
  var inFov = {};
  this._fov.compute(camX,camY,radius,function(x, y, radius, visibility) {
        inFov[x+","+y] = true;
  });

  for (var x = 0; x < dims.w; x++) {
    for (var y = 0; y < dims.h; y++) {
      // Fetch the glyph for the tile and render it to the screen - sub in wall tiles for nullTiles / out-of-bounds
      var mapPos = {x:x+xStart,y:y+yStart};
      if (inFov[mapPos.x+','+mapPos.y]) {
        var tile = this.getTile(mapPos);
        if (tile.getName() == 'nullTile') {
          tile = Game.Tile.wallTile;
        }
        tile.draw(display,x,y);
        var ent = this.getEntity(mapPos);
        if (ent) {
          ent.draw(display,x,y);
        }
      }
    }
  }

  return inFov;
};

Game.Map.prototype.setArray = function(featureArray, x, y){
  for(var i = 0; i < featureArray.length; i++){
    for(var j = 0; j < featureArray[0].length; j++){
      this._tiles[x+i][y+j] = featureArray[i][j];
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
