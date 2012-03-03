(function (exports, priv) {
  'use strict';
  
  var tilesets = {};
  
  
  
  
  
  function TileSet(name) {
    this.tiles = 1;
  }
  
  
  exports.install = function (ns) {
    // newtileset(name : string, image : string, framewidth : number, frameheight : number, originx : number, originy : number)
    ns.newtileset = function (name, image, framewidth, frameheight, originx, originy) {
    };
  };
  
  exports.install(exports);
}(gamework.graphics, gamework._));
