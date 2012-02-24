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
  
  // drawTile(x : number, y : number, w : number, h : number, index : number)
  // drawTile(pos: vector, w : number, h : number, index : number)
  // drawTile(x : number, y : number, size: vector, index : number)
  // drawTile(pos: vector, size : vector, index : number)
  // drawTile(pos: vector, index)
  // drawTile(index)
  TileSet.prototype.drawTile = function (arg1, arg2, arg3, arg4, arg5) {
    var x, y, w, h, index;
    
    if (typeof(arg5) !== 'undefined') {
      x     = +arg1;
      y     = +arg2;
      w     = +arg3;
      h     = +arg4;
      index = Math.floor(+arg5);
    }
    
    if (!(isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || isNaN(index))) {
      index = wrapIndex(index, this.tiles);
      if (isFinite(x) && isFinite(y) && isFinite(w) && isFinite(h) && isFinite(index)) {
        if ((w >= 0) && (h >= 0)) {
          // Render
        }
      }
    }
  };
  
  
  exports.install = function (ns) {
    ns.newtileset = function (name) {
    };
    
    ns.drawtile = function (name, arg1, arg2, arg3, arg4, arg5) {
    };
  };
  
  exports.install(exports);
}(micro.graphics));
