//these key binding are intended for just gamePlay at this point
Game.keyBinding = {

  _curKeys: [
     {label: 'up', keyUsed: 'w'},
     {label: 'down', keyUsed: 's'},
     {label: 'left', keyUsed: 'a'},
     {label: 'right', keyUsed: 'd'},
     {label: 'scroll_up', keyUsed: 'i'},
     {label: 'scroll_down', keyUsed: 'k'},
     {label: 'save_screen', keyUsed: 't'},
     {label: 'options', keyUsed: 'q'}
  ],
//it's important to put these templates in the same order as _curKeys
  templates: {
    wasd: [
       {label: 'up', keyUsed: 'w'},
       {label: 'down', keyUsed: 's'},
       {label: 'left', keyUsed: 'a'},
       {label: 'right', keyUsed: 'd'},
       {label: 'scroll_up', keyUsed: 'i'},
       {label: 'scroll_down', keyUsed: 'k'},
       {label: 'save_screen', keyUsed: 't'},
       {label: 'options', keyUsed: 'q'}
    ],
    arrows: [
       {label: 'up', keyUsed: 'ArrowUp'},
       {label: 'down', keyUsed: 'ArrowDown'},
       {label: 'left', keyUsed: 'ArrowLeft'},
       {label: 'right', keyUsed: 'ArrowRight'},
       {label: 'scroll_up', keyUsed: 'i'},
       {label: 'scroll_down', keyUsed: 'k'},
       {label: 'save_screen', keyUsed: 't'},
       {label: 'options', keyUsed: 'q'}
    ]
  },

  setTemplate: function(template_name){
    if(this.templates.hasOwnProperty(template_name)){
      _curKeys = this.templates[template_name];
    }else{
      console.log("there was a problem setting a key template");
    }
  },

//potentially used to check for repeats
  contains: function(toCheck){
    var matches = Game.keyBinding._curKeys.filter(
      function(elt,idx,arr) { return elt.keyUsed === toCheck; }
    );
    if(matches[0]){
      return true;
    }
    return false;
  },
//sets an individual key
//this assumes key will be of event type key press
  setKey: function(label_name, key){
    if(!this.contains(key)){
      var matches = Game.keyBinding._curKeys.filter(
        function(elt,idx,arr) { return elt.label === label_name; }
      );
      if(matches[0]){
        matches[0].keyUsed = key;
      }else{
        console.log("you f'ed up, function not legit");
      }
    }else{
      console.log("got here");
      Game.Message.send("key already used");
    }
  },

//these will be important later for saving the game
  toJSON: function(){

  },
  fromJSON: function(){

  }
}
