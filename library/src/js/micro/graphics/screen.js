var micro            = micro || {};
    micro.__graphics = micro.__graphics || {};

(function (exports) {
  'use strict';
  
  function Screen() {
    this.parent = null;
    
    this.config = {
      size: {width: 400, height: 400},
      bordercolor: micro.graphics.color(0.5, 0.5, 0.5),
      pagecolor:   micro.graphics.color(0.5, 0.5, 0.5)
    };
    
    this.layers = {
      lookup:  {},
      order:   [],
      current: null
    };
    
    this.dels = {}; // DOM Elements.
  }
  
  
  exports.install = function (ns) {
    ns.Screen = Screen;
  };
  
  exports.install(exports);
}(micro.__graphics));
