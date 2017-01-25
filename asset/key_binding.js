//these key binding are intended for just gamePlay at this point
Game.keyBinding = {

  attr: {
    _curKeys: [
      {label: 'up', keyUsed: 'w'},
      {label: 'down', keyUsed: 's'},
      {label: 'left', keyUsed: 'a'},
      {label: 'right', keyUsed: 'd'},
      {label: 'scroll_up', keyUsed: 'i'},
      {label: 'scroll_down', keyUsed: 'k'},
      {label: 'save_screen', keyUsed: 't'},
      {label: 'options', keyUsed: 'q'},
      {label: 'swap_initiate', keyUsed: ' '},
      {label: 'swap_confirm', keyUsed: 'v'},
      {label: 'item1', keyUsed: '1'},
      {label: 'item2', keyUsed: '2'},
      {label: 'item3', keyUsed: '3'},
      {label: 'item4', keyUsed: '4'}
    ]
  },

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
       {label: 'options', keyUsed: 'q'},
       {label: 'swap', keyUsed: ' '},
       {label: 'swap_confirm', keyUsed: 'v'},
       {label: 'item1', keyUsed: '1'},
       {label: 'item2', keyUsed: '2'},
       {label: 'item3', keyUsed: '3'},
       {label: 'item4', keyUsed: '4'}
    ],
    arrows: [
       {label: 'up', keyUsed: 'ArrowUp'},
       {label: 'down', keyUsed: 'ArrowDown'},
       {label: 'left', keyUsed: 'ArrowLeft'},
       {label: 'right', keyUsed: 'ArrowRight'},
       {label: 'scroll_up', keyUsed: 'i'},
       {label: 'scroll_down', keyUsed: 'k'},
       {label: 'save_screen', keyUsed: 't'},
       {label: 'options', keyUsed: 'q'},
       {label: 'swap', keyUsed: ' '},
       {label: 'swap_confirm', keyUsed: 'v'},
       {label: 'item1', keyUsed: '1'},
       {label: 'item2', keyUsed: '2'},
       {label: 'item3', keyUsed: '3'},
       {label: 'item4', keyUsed: '4'}
    ]
  },

  setTemplate: function(template_name){
    if(this.templates.hasOwnProperty(template_name)){
      this.attr._curKeys = this.templates[template_name];
    }else{
      console.log("there was a problem setting a key template");
    }
  },

//potentially used to check for repeats
  contains: function(toCheck){
    var matches = this.attr._curKeys.filter(
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
      var matches = this.attr._curKeys.filter(
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

  toJSON: function () {
    var json = Game.UIMode.gameSave.BASE_toJSON.call(this);
    return json;
  },
  fromJSON: function (json) {
    Game.UIMode.gameSave.BASE_fromJSON.call(this,json);
  },
};
