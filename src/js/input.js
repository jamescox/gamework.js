(function (exports, internal) {
  'use strict';
  
  var keyEl    = null, 
      mouseEl  = null,
      mouseX   = 0, mouseY = 0, mouseButtons = {},
      KEY_NAMES = {
        left: 37, right: 39, up: 38, down: 40,
        
        enter:     13, 'return': 13,
        backspace: 8,
        del:       46, 'delete': 46,
        ins:       45, insert: 45,
        home:      36,
        end:       35,
        esc:       27, 
        pageup:    33, pgup: 33,
        pagedown:  34, pgdown: 34,
        tab:       9,
        capslock:  20, caps: 20,
        shift:     16, 
        control:   17, ctrl: 17, ctl:  17,
        alternate: 18, alt:  18, meta: 18,
        
        space:     32,
        
        a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73,
        j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, 
        s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90,
        
        '0': 48, '1': 49, '2': 50, '3': 51, '4': 52,
        '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
      }, keys   = {};
  
  
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
    
    ns.keypressed = function (keyname) {
      var idx;
      
      if (typeof(keyname) === 'string') {
        idx = KEY_NAMES[keyname.trim().toLowerCase()];
      } else {
        idx = +keyname;
      }
      
      return keys[idx] || 0;
    };
  };
  
  internal.inputHook = function (keyel, mouseel) {
    // Unhook previously hooked elements.
    if (mouseEl) {
    }
    
    mouseEl = mouseel;
    
    window.onblur = function () { mouseButtons = {}; };
    
    keyel.onkeyup = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      keys[e.keyCode] = false;
      
      return false;
    };
    
    keyel.onkeydown = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      console.log(e.keyCode);
      
      keys[e.keyCode] = true;
      
      return false;
    };
    
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
}(gamework.input, gamework.internal));
