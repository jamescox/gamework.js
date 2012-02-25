/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */


(function (exports, Screen, NAMED_COLORS, _) {
  'use strict';
  
  var frames = 0, screen = null;
  
  
  function Color(r, g, b, a) {
    this.r = r; this.g = g; this.b = b; this.a = a;
    Object.freeze(this);
  }
  
  Color.prototype.toString = function () {
    return 'color(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
  };
  
  Color.prototype.toCss = function () {
    if (this.a !== 1) {
      return ('rgba(' + Math.floor(this.r * 255) + ',' + 
                        Math.floor(this.g * 255) + ',' + 
                        Math.floor(this.b * 255) + ',' + 
                        this.a + ')');
    } else {
      return ('rgb(' + Math.floor(this.r * 255) + ',' + 
                        Math.floor(this.g * 255) + ',' + 
                        Math.floor(this.b * 255) + ')');
    }
  };
  
  function color(arg1, arg2, arg3, arg4) {
    var r, g, b, a, c = null;
    
    if (typeof(arg1) !== 'undefined') {
      if ((typeof(arg2) !== 'undefined') && (typeof(arg3) !== 'undefined')) {
        // 3 arguments, should be three number like values:  r, g, b.
        r = +arg1;
        g = +arg2;
        b = +arg3;
        
        if (typeof(arg4) !== 'undefined') {
          // has 4th argumens, should be a number like value for alpha.
          a = +arg4;
        } else {
          // Alpha default to 100%.
          a = 1;
        }
      } else {
        // 1 argument, should be a color like object or color name.
        switch (micro.types.gettype(arg1)) {
        case 'string':
          if (NAMED_COLORS.hasOwnProperty(arg1.toLowerCase())) {
            r = NAMED_COLORS[arg1][0] / 255;
            g = NAMED_COLORS[arg1][1] / 255;
            b = NAMED_COLORS[arg1][2] / 255;
            a = 1;
          }
          break;
        
        case 'array':
          if (arg1.length === 3) {
            r = +arg1[0];
            g = +arg1[1];
            b = +arg1[2];
            a = 1;
          } else if (arg1.length === 4) {
            r = +arg1[0];
            g = +arg1[1];
            b = +arg1[2];
            a = +arg1[3];
          }
          break;
        
        case 'object':
          r = +arg1.r;
          g = +arg1.g;
          b = +arg1.b;
          
          if (typeof(arg1.a) !== 'undefined') {
            a = +arg1.a;
          } else {
            a = 1;
          }
          break;
        }
      }
    }
    
    if (!(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))) {
      if ((r >= 0) && (r <= 1) &&
          (g >= 0) && (g <= 1) &&
          (b >= 0) && (b <= 1) &&
          (a >= 0) && (a <= 1)) {
        c = new Color(r, g, b, a);
      }
    }
    
    return c;
  }
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      frames: {
        get: function () {
          return frames;
        },
        enumerable: true
      },
      
      bordercolor: {
        get: function () {
          return screen.getBorderColor();
        },
        set: function (color) {
          screen.setBorderColor(color);
        },
        enumerable: true
      },
      
      pagecolor: {
        get: function () {
          return screen.getPageColor();
        },
        set: function (color) {
          screen.setPageColor(color);
        },
        enumerable: true
      },
      
      pagesize: {
        get: function () {
          return screen.getSize();
        },
        set: function (size) {
          screen.setSize(size);
        },
        enumerable: true
      },
      
      pagewidth: {
        get: function () {
          return screen.getSize().x;
        },
        set: function (width) {
          var oldSize = screen.getSize(),
              newSize = {x: width, y: oldSize.y};
          
          screen.setSize(newSize);
        },
        enumerable: true
      },
      
      pageheight: {
        get: function () {
          return screen.getSize().y;
        },
        set: function (height) {
          var oldSize = screen.getSize(),
              newSize = {x: oldSize.x, y: height};

          screen.setSize(newSize);
        },
        enumerable: true
      },
      
      skin: {
        get: function () {
          return screen.layers.current.currentSprite.getSkin();
        },
        set: function (skin) {
          screen.layers.current.currentSprite.setSkin(skin);
        },
        enumerable: true
      },
      
      pencolor: {
        get: function () {
          return screen.layers.current.currentSprite.getPenColor();
        },
        set: function (color) {
          screen.layers.current.currentSprite.setPenColor(color);
        },
        enumerable: true
      },
      
      pensize: {
        get: function () {
          return screen.layers.current.currentSprite.getPenSize();
        },
        set: function (size) {
          screen.layers.current.currentSprite.setPenSize(size);
        },
        enumerable: true
      },
      
      spriteupdate: {
        get: function () {
          return screen.layers.current.currentSprite.getUserUpdateFunction();
        },
        set: function (fn) {
          screen.layers.current.currentSprite.setUserUpdateFunction(fn);
        },
        enumerable: true
      },
      
      sprite: {
        get: function () {
          return screen.layers.current.getCurrentSpriteName();
        },
        set: function (name) {
          screen.layers.current.setCurrentSpriteName(name);
        },
        enumerable: true
      }
    });
  
    ns.resize = function (arg1, arg2) {
      screen.setSize(arg1, arg2);
    };
  
    ns.newsprite = function (name) {
      return screen.layers.current.newSprite(name);
    };
  
    ns.show = function () {
      screen.layers.current.currentSprite.show();
    };
  
    ns.hide = function () {
      screen.layers.current.currentSprite.hide();
    };
    
    ns.pendown = function () {
      screen.layers.current.currentSprite.penDown();
    };
  
    ns.penup = function () {
      screen.layers.current.currentSprite.penUp();
    };
    
    ns.forward = function (m) {
      screen.layers.current.currentSprite.forward(m);
    };
    
    ns.back = function (m) {
      screen.layers.current.currentSprite.back(m);
    };
    
    ns.right = function (a) {
      screen.layers.current.currentSprite.right(a);
    };
    
    ns.left = function (a) {
      screen.layers.current.currentSprite.left(a);
    };
    
    ns.moveto = function (arg1, arg2) {
      screen.layers.current.currentSprite.moveTo(arg1, arg2);
    };

    ns.color = color;
  };
  
  _.graphicsOnLoad = function (parent) {
    if (screen === null) {
      screen = new Screen();
    }
    
    screen.setParent(parent);
  };
  
  _.graphicsUpdate = function () {
    if (screen) {
      screen.update();
    }
    
    frames += 1;
  };
  
  exports.install(exports);
}(micro.graphics, micro._.Screen, micro._.NAMED_COLORS, micro._));
