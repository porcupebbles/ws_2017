Game.DATASTORE.ITEM = {};

Game.Item = function(template) {
    template = template || {};
    // console.log("creating entity using template");
    // Game.util.cdebug(template);
    this._mixinSet = Game.ItemMixin;
    Game.SymbolActive.call(this, template);
    this.attr._generator_template_key = template.generator_template_key || '';

    Game.DATASTORE.ITEM[this.attr._id] = this;
};
Game.Item.extend(Game.SymbolActive);

//this doesn't provide a way to remove items on the map
Game.Item.prototype.destroy = function(){
  Game.getAvatar().removeItem(this); //this will be a sticking point if there are ever other entities with inventories
  Game.DATASTORE.ITEM[this.getId()] = undefined;
};

Game.Item.prototype.getInfo = function(){
  var theInfo = this.getName();
  if(this.hasMixin('Armor')){
    theInfo = theInfo + " (" +this.getCurrentHp() + "/" + this.getMaxHp()+")";
  }else if(this.hasMixin('MeleeAttack')){
    theInfo = theInfo + " ("+this.getDamage()+", "+this.getDurability()+")";
  }
  return theInfo;
};

Game.Item.prototype.toJSON = function () {
  var json = Game.UIMode.gameSave.BASE_toJSON.call(this);
  return json;
};
Game.Item.prototype.fromJSON = function (json) {
  Game.UIMode.gameSave.BASE_fromJSON.call(this,json);
};

Game.Item.DEFAULT_COLOR_Weapon = '#ff1a1a';
Game.Item.DEFAULT_COLOR_Armor = '#1a75ff';
Game.Item.DEFAULT_COLOR_Misc = '#9900cc';
