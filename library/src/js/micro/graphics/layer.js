var micro            = micro || {};
    micro.__graphics = micro.__graphics || {};

(function (exports) {
  'use strict';
  
  function Layer(name, screen) {
  };
  
  
  exports.install = function (ns) {
    ns.Layer = Layer;
  };
  
  exports.install(exports);
}(micro.__graphics));
