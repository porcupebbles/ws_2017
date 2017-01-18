Game.Symbol = function (properties) {
  properties = properties || {};
  if (! ('attr' in this)) { this.attr = {}; }
  this.attr._char = properties.chr || ' ';
  this.attr._fg = properties.fg || Game.UIMode.DEFAULT_COLOR_FG;
  this.attr._bg = properties.bg || Game.UIMode.DEFAULT_COLOR_BG;
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

Game.Symbol.prototype.draw = function (display,dispx,dispy) {
  display.draw(dispx,dispy,this.attr._char,this.attr._fg,this.attr._bg);
};

Game.Symbol.NULL_SYMBOL = new Game.Symbol();
Game.Symbol.AVATAR = new Game.Symbol({chr:'@', fg:'#dda'});
