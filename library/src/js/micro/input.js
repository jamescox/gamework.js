var micro       = micro || {};
    micro.input = micro.input || {};

(function (exports) {
  'use strict';
  
  var keyEl = null, mouseEl = null;
  
  
  exports.install = function (ns) {
    ns.__hook = function (keyel, mouseel) {
      // Unhook previously hooked elements.
      /*
      if (keyEl) {
        //
      }
      if (mouseEl) {
      }*/
    };
    
    
    Object.defineProperties(ns, {
      mousex: {
        get: function () {
        }
      },
      mousey: {
        get: function () {
        }
      }
    });
    
    ns.mousebutton = function (button) {
    };
    
    ns.key = function (keyname) {
    };
  };
  
  exports.install(exports);
}(micro.input));