Game.Message = {
  _curMessages: [],
  _messageNum: 1,
  render: function (display) {
    display.clear();
    if(this._curMessages.length != 0){
      display.drawText(1,1,
        this._curMessages.slice(this._messageNum, this._messageNum+Game.display.message.h).join("\n"),
        '#fff','#000');
    }
  },
  //can't handle a hash of messages
  send: function (msg) {
    this._curMessages.push(msg);
  },
  clear: function () {
    this._curMessages = [];
  },
  setDisplayedMessage: function(newNum){
    this._messageNum = newNum;
  }
};
