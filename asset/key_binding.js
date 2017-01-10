//these key binding are intended for just gamePlay at this point
Game.keyBinding = {

  _curKeys: {
    //these are referred to as function names
    //whenever a new one is added templateBinding also has to be updated
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    scroll_up: 'i',
    scroll_down: 'k',
    save_screen: 't'
  },

//it's important to put these templates in the same order as _curKeys
  templates: {
    wasd: ['w', 's', 'a', 'd', 'i', 'k', 't'],
    arrows: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'i', 'k', 't']
  },

  setTemplate: function(template_name){
    var i = 0;
    for(var key in this._curKeys){
      this._curKeys[key] = this.templates[template_name][i];
      i++;
    }
    console.dir(this._curKeys);
  },

//potentially used to check for repeats
  contains: function(toCheck){
    if(toCheck in this._curKeys){
      return true;
    }
    return false;
  },
//sets an individual key
//this assumes key will be of event type key press
  setKey: function(function_name, key){
    if(!this.contains(key)){
      if(this._curKeys.hasOwnProperty(function_name)){
        this._curKeys[function_name] = key;
      }else{
        console.log("you f'ed up, function not legit");
      }
  }
  },

//these will be important later for saving the game
  toJSON: function(){

  },
  fromJSON: function(){

  }
}
