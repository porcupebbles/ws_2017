//used to check an array of hashes for a given value
//at the given name
Array.prototype.find = function(name, value){
  var matches = this.filter(
    function(elt,idx,arr) {return elt[name] === value; }
  );
  if(matches[0]){
    return matches[0];
  }
  return null;
};
