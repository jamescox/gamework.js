(function (exports) {
  'use strict';
  
  var tilesets = {};
  
  
  function wrapIndex(index, bound) {
    if (index >= 0) {
      index = index % bound;
    } else {
      // TODO:  This works but I'm sure it could be simplified.
      index = (bound - (Math.abs(index) % bound)) % bound;
    }
    
    return index;
  } 
  
  
  function TileSet(name) {
    this.tiles = 1;
  }
  
  
  exports.install = function (ns) {
    ns.TileSet = TileSet;
  };
  
  exports.install(exports);
}(micro._));
