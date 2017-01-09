Game.Message = {
  _curMessage: [],

  render: function (display) {
    display.clear();
    if(this._curMessage.length != 0){
      display.drawText(1,1,this._curMessage.join(),'#fff','#000');
    }
  },
  send: function (msg) {
    this._curMessage.push(msg);
  },
  clear: function () {
    this._curMessage = [];
  }
};
