Game.Message = {
  attr: {
    _curMessages: [],
    _messageNum: 0
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
  }
};
