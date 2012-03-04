(function (exports) {
  'use strict';
  
  function TileMap(name, layer) {
  };
  
  
  exports.install = function (ns) {
    ns.TileMap = TileMap;
  };
  
  exports.install(exports);
}(gamework._));
