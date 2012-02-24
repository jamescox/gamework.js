(function (exports, _) {
  'use strict';
  
  var keyEl = null, mouseEl = null;
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      mousex: {
        get: function () {
        },
        enumerable: true
      },
      mousey: {
        get: function () {
        },
        enumerable: true
      }
    });
    
    ns.mousebutton = function (button) {
    };
    
    ns.key = function (keyname) {
    };
  };
  
  _.inputHook = function (keyel, mouseel) {
    // Unhook previously hooked elements.
    /*
    if (keyEl) {
      //
    }
    if (mouseEl) {
    }*/
  };
  
  exports.install(exports);
}(micro.input, micro._));
