var micro            = micro || {};
    micro.__graphics = micro.__graphics || {};

(function (exports) {
  'use strict';
  
  function TileMap(name, layer) {
  };
  
  
  exports.install = function (ns) {
    ns.TileMap = TileMap;
  };
  
  exports.install(exports);
}(micro.__graphics));
