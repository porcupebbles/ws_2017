Game.Symbol = function (properties) {
  properties = properties || {};
  if (! ('attr' in this)) { this.attr = {}; }
  this.attr._char = properties.chr || ' ';
  this.attr._fg = properties.fg || Game.UIMode.DEFAULT_COLOR_FG;
  this.attr._bg = properties.bg || Game.UIMode.DEFAULT_COLOR_BG;
  this.attr._Swappable = properties.swappable || true; //means the block this symbol is on will not swap
};

Game.Symbol.prototype.isSwappable = function(){
  return this.attr._Swappable;
};
Game.Symbol.prototype.setSwappable = function(state){
  this.attr._Swappable = state;
};

Game.Symbol.prototype.getChar = function () {
  return this.attr._char;
};

Game.Symbol.prototype.getFg = function () {
  return this.attr._fg;
};

Game.Symbol.prototype.getBg = function () {
  return this.attr._bg;
};

Game.Symbol.prototype.setFg = function (color){
  this.attr._fg = color;
};

Game.Symbol.prototype.setBg = function (color){
  this.attr._bg = color;
};

Game.Symbol.prototype.draw = function (display,disp_x,disp_y,isMasked) {
  if (isMasked) {
    display.draw(disp_x,disp_y,this.attr._char,'#444','#000');
  } else {
    display.draw(disp_x,disp_y,this.attr._char,this.attr._fg,this.attr._bg);
  }
};

Game.Symbol.NULL_SYMBOL = new Game.Symbol();
Game.Symbol.AVATAR = new Game.Symbol({chr:'@', fg:'#dda'});

Game.Symbol.ITEM_PILE = new Game.Symbol({chr:'&',fg:'#dcc'});
