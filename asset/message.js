Game.Message = {
  attr: {
    _curMessages: [],
    _messageNum: 0
  },


  presets: {
    armor_use: {cur: 0, max: Game.PresetMessages.armor_use.length,lines: Game.PresetMessages.armor_use},
    armor_loss: {cur: 0, max: Game.PresetMessages.armor_loss.length, lines: Game.PresetMessages.armor_loss}
  },

  render: function (display) {
    display.clear();
    if(this.attr._curMessages.length != 0){
      display.drawText(1,1,
        this.attr._curMessages.slice(this.attr._messageNum, this.attr._messageNum+Game.display.message.h).join("\n"),
        '#fff','#000');
    }
  },
  //can't handle a hash of messages
  send: function (msg) {
    this.attr._curMessages.push(msg);
  },
  clear: function () {
    this.attr._curMessages = [];
  },
  setDisplayedMessage: function(newNum){
    this.attr._messageNum = newNum;
  },
  sendPreset: function(type){
    console.log("presets");
    console.dir(this.presets);
    console.log("type");
    console.dir(this.presets[type]);
    var num = this.presets[type].cur;
    if(num != this.presets[type].max){
      this.presets[type] = num + 1;
    }
  },

};
