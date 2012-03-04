(function (exports, _) {
  'use strict';
  
  var keyEl   = null, 
      mouseEl = null,
      mouseX  = 0,    mouseY = 0, mouseButtons = {},
      keys    = {};
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      mousex: {
        get: function () {
          return mouseX;
        },
        enumerable: true
      },
      mousey: {
        get: function () {
          return mouseY;
        },
        enumerable: true
      }
    });
    
    ns.mousebutton = function (button) {
      return mouseButtons[button] || 0;
    };
    
    ns.keystate = function (keyname) {
    };
  };
  
  _.inputHook = function (keyel, mouseel) {
    // Unhook previously hooked elements.
    if (mouseEl) {
    }
    
    mouseEl = mouseel;
    
    window.onblur = function () { mouseButtons = {}; };
    
    mouseEl.onmousemove = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      mouseX = e.pageX - (mouseEl.offsetWidth / 2);
      mouseY = -(e.pageY - (mouseEl.offsetHeight / 2));
      
      return false;
    };
    
    mouseEl.onmousedown = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      mouseButtons[e.which] = 1;
      
      return false;
    };
    
    mouseEl.onmouseup = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      mouseButtons[e.which] = 0;
      
      return false;
    };
    
    mouseEl.oncontextmenu = function () { return false; };
  };
  
  exports.install(exports);
}(gamework.input, gamework._));
