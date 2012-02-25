(function () {
  var module = {};
  
  module._ = {};
  
  module.app         = {};
  module.collections = {};
  module.graphics    = {};
  module.input       = {};
  module.math        = {};
  module.music       = {};
  module.sound       = {};
  module.string      = {};
  module.types       = {};
  
  Object.defineProperty(window, 'micro', {value: module, enumerable: true});
}());
/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

(function (exports) {
  'use strict';
  
  exports.install = function (ns) {
    ns.gettype = function (value) {
      var type = typeof(value);
      
      if (type === 'object') {
        if (value) {
          if (value instanceof Array) {
            return 'array';
          }
        } else {
          return 'null';
        }
      }
      
      return type;
    };
      
    
    ns.isarray = function (value) {
      return micro.types.gettype(value) === 'array';
    };
    
    ns.isboolean = function (value) {
      return micro.types.gettype(value) === 'boolean';
    };
    
    ns.isfunction = function (value) {
      return micro.types.gettype(value) === 'function';
    };
    
    ns.isnull = function (value) {
      return micro.types.gettype(value) === 'null';
    };
    
    ns.isnumber = function (value) {
      return micro.types.gettype(value) === 'number';
    };
    
    ns.isobject = function (value) {
      return micro.types.gettype(value) === 'object';
    };
    
    ns.isstring = function (value) {
      return micro.types.gettype(value) === 'string';
    };
    
    ns.isundefined = function (value) {
      return micro.types.gettype(value) === 'undefined';
    };
  };

  exports.install(exports);
}(micro.types));
/*jslint browser: true, sub: true, white: true, maxerr: 50, indent: 2 */
  
(function (exports) {
  'use strict';
  
  exports.install = function (ns) {
    ns.charcode = function (ch) {
      return ch.charCodeAt(0);
    };
    
    ns['char'] = function (code) {
      return String.fromCharCode(code);
    };
    
    ns.tobinstring = function (number) {
      return (+number).toString(2);
    };
    
    ns.tooctstring = function (number) {
      return (+number).toString(8);
    };
    
    ns.tohexstring = function (number) {
      return (+number).toString(16);
    };
    
    ns.frombinstring = function (str) {
      return parseInt(str, 2);
    };
    
    ns.fromoctstring = function (str) {
      return parseInt(str, 8);
    };
    
    ns.fromhexstring = function (str) {
      return parseInt(str, 16);
    };
  };
  
  exports.install(exports);
  
}(micro.string));

/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

/*
    TODO:
     *  Add constructor functions for multi-dimentional arrays.
     *  Implement filter.
     *  Add first, second, third, etc. & rest (a-la Common LISP).
     *  Add last & butlast (a-la Common LISP).
     *  Add predicates: isempty, haskey, etc.
 */


(function (exports) {
  'use strict';

  exports.install = function (ns) {
    Object.defineProperties(ns, {
      foreach: { 
        value: function (fn, col) {
          var key, i, coltype = micro.types.gettype(col);
          
          if ((coltype === 'string') || (coltype === 'array')) {
            for (i = 0; i < col.length; i += 1) {
              fn(col[i], i, col);
            }
          } else if (coltype === 'object') {
            for (key in col) {
              if (col.hasOwnProperty(key)) {
                fn(col[key], key, col);
              }
            }
          }
        }
      },
      
      map: { 
        value: function (fn, col) {
          var ret, key, i, coltype = micro.types.gettype(col);
          
          if (coltype === 'string') {
            ret = '';
            for (i = 0; i < col.length; i += 1) {
              ret += fn(col[i], i, col).toString();
            }
          } else if (coltype === 'array') {
            ret = [];
            for (i = 0; i < col.length; i += 1) {
              ret.push(fn(col[i], i, col));
            }
          } else if (coltype === 'object') {
            ret = {};
            for (key in col) {
              if (col.hasOwnProperty(key)) {
                ret[key] = fn(col[key], key, col);
              }
            }
          }
          
          return ret;
        }
      },
      
      reduce: {
        value: function (fn, a, col) {
          var key, i, coltype = micro.types.gettype(col);
          
          if ((coltype === 'string') || (coltype === 'array')) {
            for (i = 0; i < col.length; i += 1) {
              a = fn(a, col[i], i, col);
            }
          } else if (coltype === 'object') {
            for (key in col) {
              if (col.hasOwnProperty(key)) {
                a = fn(a, col[key], key, col);
              }
            }
          }
          
          return a;
        }
      },
      
      filter: {
        value: function (/*p, col*/) {
          // TODO
        }
      }
    });
    
    Object.defineProperties(ns, {  
      makezerolist: {
        value: function () {
          // TODO
        }
      },
      
      makenulllist: {
        value: function () {
          // TODO
        }
      }
    });
    
    
    Object.defineProperties(ns, {
      len: {
        value: function (col) {
          var coltype = micro.types.gettype(col);
          
          if ((coltype === 'string') || (coltype === 'array')) {
            return col.length;
          } else if (coltype === 'object') {
            return micro.collections.reduce(function (a) { 
              return a + 1; 
            }, 0, col);
          }
        }
      },
      
      keys: {
        value: function (col) {
          var key, keys = [];
          
          if (micro.types.gettype(col) === 'object') {
            for (key in col) {
              if (col.hasOwnProperty(key)) {
                keys.push(key);
              }
            }
          }
          
          return keys;
        }
      },
      
      values: {
        value: function (col) {
          var key, values = [];
          
          if (micro.types.gettype(col) === 'object') {
            for (key in col) {
              if (col.hasOwnProperty(key)) {
                values.push(col[key]);
              }
            }
          }
          
          return values;
        }
      }
    });
  };
              
  exports.install(exports);
}(micro.collections)); 
/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

/*  
    TODO:  
     *  Add maths predicates.
     *  Implement mode.
     *  Implement median.  
     *  Add custom RNG to support seeding.
     *  Add vector math functions.
     *  JSLint this module.
 */

(function (exports) {
  'use strict';
  
  var SCALE_RAD  = 1.0,
      SCALE_DEG  = Math.PI / 180,
      SCALE_REV  = Math.PI * 2,
      angleUnit  = 'deg',
      angleScale = SCALE_DEG;
  
  
  function Vector(x, y) {
    this.x = x;
    this.y = y;
    
    Object.freeze(this);
  }
  
  Vector.prototype.toString = function () {
    return 'vector(' + this.x + ', ' + this.y + ')';
  };
  
  // TODO:  Add some vector math stuff here.
  

  exports.install = function (ns) {
    // Constants.
    ns.pi = Math.PI;
    ns.tau = Math.PI * 2;
    
    
    // Vector math.
    // vector(x, y)
    // vector(vector(...))
    ns.vector = function (arg1, arg2) {
      var v = null;
      
      if (typeof(arg1) !== 'undefined') {
        if (typeof(arg2) !== 'undefined') {
          // 2 arguments, should be two number like values.
          arg1 = +arg1;
          arg2 = +arg2;
          
          if (!(isNaN(arg1) || isNaN(arg2)) && isFinite(arg1) && isFinite(arg2)) {
            // NOTE:  Finite restriction maybe too strict will look at this
            //        later.
            v = new Vector(arg1, arg2);
          }
        } else {
          // 1 argument, should be a vector like object.
          if ((micro.types.gettype(arg1) === 'array') && (arg1.length === 2)) {
            // Two element array.
            arg2 = arg1[1];
            arg1 = arg1[0];
            
            v = vector(arg1, arg2);
          } else if (micro.types.gettype(arg1) === 'object') {
            // Vector like object.
            arg2 = arg1.y;
            arg1 = arg1.x;
            
            if ((typeof(arg1) !== 'undefined') && (typeof(arg2) !== 'undefined')) {
              v = micro.math.vector(arg1, arg2);
            }
          }
        }
      }
      
      return v;
    };
    
    
    // Trigonometry.
    Object.defineProperties(ns, {
      angleunits: {
        get: function () {
          return angleUnit;
        },
        set: function (unit) {
          unit = unit.toLowerCase().substring(0, 3);
          
          if (unit === 'rad') {        // Radians (native JavaScript units)
            angleScale = SCALE_RAD;
            angleUnit  = unit;
          } else if (unit === 'deg') { // Degrees
            angleScale = SCALE_DEG;
            angleUnit  = unit;
          } else if (unit === 'rev') { // Revolutions (turns)
            angleScale = SCALE_REV;
            angleUnit  = unit;
          }
        },
        enumerable: true
      }
    });
    
    
    ns.torad = function (a /* Angle in current angleunits.  */) {
      return (a * angleScale) * SCALE_RAD; // Angle in radians.
    };
  
    ns.fromrad = function (a /* Angle in radians.  */) {
      return (a / angleScale) / SCALE_RAD;  // Angle in current angleunits.
    };
    
    
    ns.todeg = function (a /* Angle in current angleunits.  */) {
      return (a * angleScale) * SCALE_DEG; // Angle in degrees.
    };
  
    ns.fromdeg = function (a /* Angle in degrees.  */) {
      return (a / angleScale) / SCALE_DEG;  // Angle in current angleunits.
    };
    
    
    ns.torev = function (a /* Angle in current angleunits.  */) {
      return (a * angleScale) * SCALE_REV; // Angle in revolutions.
    };
  
    ns.fromrev = function (a /* Angle in revolutions.  */) {
      return (a / angleScale) * SCALE_REV;  // Angle in current angleunits.
    };
    
    
    ns.sin = function (a) {
      return Math.sin(a * angleScale);
    };

    ns.cos = function (a) {
      return Math.cos(a * angleScale);
    };

    ns.tan = function (a) {
      return Math.tan(a * angleScale);
    };
      
    ns.arctan = function (t) {
      return Math.atan(t) / angleScale;
    };
      
    ns.arctan2 = function (x, y) {
      // The idea here is to have 0 face upwards just like the sprite 
      // system works.
      return Math.atan2(x, y) / angleScale;
    };
    
    
    // Exponents, powers and roots.  
    ns.exp   = Math.exp;
    ns.log   = Math.log;
    ns.log10 = function (n) { return Math.log(n) / Math.log(10); };
    ns.pow   = Math.pow;
    ns.sqrt  = Math.sqrt;
      
    
    // Rounding.
    ns['int'] = Math.floor;
    ns.round  = Math.round;
    ns.cint   = Math.ceil;
      
    
    // Radom number generation.
    ns.random = function (arg1, arg2 /* [upper=1 | lower=0, upper=1] */) {
      var lower = 0, upper = 1;
      
      if (typeof(arg1) !== 'undefined') {
        if (typeof(arg2) !== 'undefined') {
          lower = +arg1;
          upper = +arg2;
        } else {
          upper = +arg1;          
        }
      }

      return lower + Math.random() * (upper - lower);
    };
      
    ns.randomint = function (arg1, arg2 /* [upper=1 | lower=0, upper=1] */) {
      var lower = 0, upper = 1;
      
      if (typeof(arg1) !== 'undefined') {
        if (typeof(arg2) !== 'undefined') {
          lower = Math.floor(arg1);
          upper = Math.floor(arg2);
        } else {
          upper = Math.floor(arg1);
        }
      }
      
      upper += 1;
      
      return lower + Math.floor(Math.random() * (upper - lower));
    };
  
    ns.randompick = function (col) {
      var keys, coltype = micro.types.gettype(col);
      
      if ((coltype === 'string') || (coltype === 'array')) {
        return col[micro.math.randomint(col.length - 1)];
      } else if (coltype === 'object') {
        keys = micro.collections.keys(col);
        
        return keys[micro.math.randomint(keys.length - 1)];
      }
    };
    
    
    // Collections
    ns.min = Math.min;
    ns.max = Math.max;
      
    ns.sum = function (/* [collection<number> | number...] */) {
      var args     = Array.prototype.slice.call(arguments), 
          arg0type = micro.types.gettype(args[0]);
    
      if (args.length === 0) {
        return 0;
      } else if (args.length === 1) {
        if (arg0type === 'number') {
          return args[0];
        } else if ((arg0type === 'object') || (arg0type === 'array')) {
          return micro.collections.reduce(function (acc, value) {
            return acc + value;
          }, 0, args[0]);
        } else {
          return +args[0];
        }
      } else {
        return micro.math.sum(args);
      }
    };
      
    ns.mean = function (/* [collection<number> | number...] */) {
      var args     = Array.prototype.slice.call(arguments), 
          arg0type = micro.types.gettype(args[0]);
    
      if (args.length === 0) {
        return 0;
      } else if (args.length === 1) {
        if (arg0type === 'number') {
          return args[0];
        } else if ((arg0type === 'object') || (arg0type === 'array')) {
          return micro.math.sum(args[0]) / micro.collections.len(args[0]);
        } else {
          return +args[0];
        }
      } else {
        return micro.math.mean(args);
      }
    };
    
    
    // Misc.
    ns.abs = Math.abs;
      
    ns.normal = function (n) {
      return n === 0 ? 0 : n / micro.math.abs(n);
    };
  };
  
  exports.install(exports);
}(micro.math));
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
(function (exports) {
  var sounds = {};
  
  
  function loadSound(name) {
    var src, sound = null;
    
    if (sounds.hasOwnProperty(name)) {
      sound = sounds[name];
    } else {
      sound = new Audio();
      
      sound.setAttribute('preload', 'preload');
      
      micro.app.startloadtask();
      sound.oncanplay = micro.app.endloadtask;
      
      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.wav');
      src.setAttribute('type', 'audio/wav');
      sound.appendChild(src);

      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.ogg');
      src.setAttribute('type', 'audio/vorbis');
      sound.appendChild(src);
      
      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.mp3');
      src.setAttribute('type', 'audio/mp3');
      sound.appendChild(src);
      
      sound.load();
      
      sounds[name] = sound;
      
      document.body.appendChild(sound);
    }
    
    return sound;
  }
  
  
  function playSound(name) {
    var sound;
    
    if (sounds.hasOwnProperty(name)) {
      sound = sounds[name];
    } else {
      sound = loadSound(name);
    }
    
    console.log(sound.currentSrc);
    sound.currentTime = 0;
    sound.play();
  }
  
  
  exports.install = function (ns) {
    ns.loadsound = loadSound;
    ns.playsound = playSound;
  };
  
  exports.install(exports);
}(micro.sound));
// Taken from: http://news.e-scribe.com/361.  
micro._.NAMED_COLORS = {
  "aliceblue":            [240, 248, 255],
  "antiquewhite":         [250, 235, 215],
  "aquamarine":           [127, 255, 212],
  "azure":                [240, 255, 255],
  "beige":                [245, 245, 220],
  "bisque":               [255, 228, 196],
  "black":                [  0,   0,   0],
  "blanchedalmond":       [255, 235, 205],
  "blue":                 [  0,   0, 255],
  "blueviolet":           [138,  43, 226],
  "brown":                [165,  42,  42],
  "burlywood":            [222, 184, 135],
  "cadetblue":            [ 95, 158, 160],
  "chartreuse":           [127, 255,   0],
  "chocolate":            [210, 105,  30],
  "coral":                [255, 127,  80],
  "cornflowerblue":       [100, 149, 237],
  "cornsilk":             [255, 248, 220],
  "cyan":                 [  0, 255, 255],
  "darkgoldenrod":        [184, 134,  11],
  "darkgreen":            [  0, 100,   0],
  "darkkhaki":            [189, 183, 107],
  "darkolivegreen":       [ 85, 107,  47],
  "darkorange":           [255, 140,   0],
  "darkorchid":           [153,  50, 204],
  "darksalmon":           [233, 150, 122],
  "darkseagreen":         [143, 188, 143],
  "darkslateblue":        [ 72,  61, 139],
  "darkslategray":        [ 47,  79,  79],
  "darkturquoise":        [  0, 206, 209],
  "darkviolet":           [148,   0, 211],
  "deeppink":             [255,  20, 147],
  "deepskyblue":          [  0, 191, 255],
  "dimgray":              [105, 105, 105],
  "dodgerblue":           [ 30, 144, 255],
  "firebrick":            [178,  34,  34],
  "floralwhite":          [255, 250, 240],
  "forestgreen":          [ 34, 139,  34],
  "gainsboro":            [220, 220, 220],
  "ghostwhite":           [248, 248, 255],
  "gold":                 [255, 215,   0],
  "goldenrod":            [218, 165,  32],
  "gray":                 [128, 128, 128],
  "green":                [  0, 128,   0],
  "greenyellow":          [173, 255,  47],
  "honeydew":             [240, 255, 240],
  "hotpink":              [255, 105, 180],
  "indianred":            [205,  92,  92],
  "ivory":                [255, 255, 240],
  "khaki":                [240, 230, 140],
  "lavender":             [230, 230, 250],
  "lavenderblush":        [255, 240, 245],
  "lawngreen":            [124, 252,   0],
  "lemonchiffon":         [255, 250, 205],
  "lightblue":            [173, 216, 230],
  "lightcoral":           [240, 128, 128],
  "lightcyan":            [224, 255, 255],
  "lightgoldenrod":       [238, 221, 130],
  "lightgoldenrodyellow": [250, 250, 210],
  "lightgray":            [211, 211, 211],
  "lightpink":            [255, 182, 193],
  "lightsalmon":          [255, 160, 122],
  "lightseagreen":        [ 32, 178, 170],
  "lightskyblue":         [135, 206, 250],
  "lightslate":           [132, 112, 255],
  "lightslategray":       [119, 136, 153],
  "lightsteelblue":       [176, 196, 222],
  "lightyellow":          [255, 255, 224],
  "limegreen":            [ 50, 205,  50],
  "linen":                [250, 240, 230],
  "magenta":              [255,   0, 255],
  "maroon":               [176,  48,  96],
  "mediumaquamarine":     [102, 205, 170],
  "mediumblue":           [  0,   0, 205],
  "mediumorchid":         [186,  85, 211],
  "mediumpurple":         [147, 112, 219],
  "mediumseagreen":       [ 60, 179, 113],
  "mediumslateblue":      [123, 104, 238],
  "mediumspringgreen":    [  0, 250, 154],
  "mediumturquoise":      [ 72, 209, 204],
  "mediumviolet":         [199,  21, 133],
  "midnightblue":         [ 25,  25, 112],
  "mintcream":            [245, 255, 250],
  "mistyrose":            [255, 228, 225],
  "moccasin":             [255, 228, 181],
  "navajowhite":          [255, 222, 173],
  "navy":                 [  0,   0, 128],
  "oldlace":              [253, 245, 230],
  "olivedrab":            [107, 142,  35],
  "orange":               [255, 165,   0],
  "orangered":            [255,  69,   0],
  "orchid":               [218, 112, 214],
  "palegoldenrod":        [238, 232, 170],
  "palegreen":            [152, 251, 152],
  "paleturquoise":        [175, 238, 238],
  "palevioletred":        [219, 112, 147],
  "papayawhip":           [255, 239, 213],
  "peachpuff":            [255, 218, 185],
  "peru":                 [205, 133,  63],
  "pink":                 [255, 192, 203],
  "plum":                 [221, 160, 221],
  "powderblue":           [176, 224, 230],
  "purple":               [160,  32, 240],
  "red":                  [255,   0,   0],
  "rosybrown":            [188, 143, 143],
  "royalblue":            [ 65, 105, 225],
  "saddlebrown":          [139,  69,  19],
  "salmon":               [250, 128, 114],
  "sandybrown":           [244, 164,  96],
  "seagreen":             [ 46, 139,  87],
  "seashell":             [255, 245, 238],
  "sienna":               [160,  82,  45],
  "skyblue":              [135, 206, 235],
  "slateblue":            [106,  90, 205],
  "slategray":            [112, 128, 144],
  "snow":                 [255, 250, 250],
  "springgreen":          [  0, 255, 127],
  "steelblue":            [ 70, 130, 180],
  "tan":                  [210, 180, 140],
  "thistle":              [216, 191, 216],
  "tomato":               [255,  99,  71],
  "turquoise":            [ 64, 224, 208],
  "violet":               [238, 130, 238],
  "violetred":            [208,  32, 144],
  "wheat":                [245, 222, 179],
  "white":                [255, 255, 255],
  "whitesmoke":           [245, 245, 245],
  "yellow":               [255, 255,   0],
  "yellowgreen":          [154, 205,  50]
};
(function (exports) {
  'use strict';
  
  function TileMap(name, layer) {
  };
  
  
  exports.install = function (ns) {
    ns.TileMap = TileMap;
  };
  
  exports.install(exports);
}(micro._));
(function (exports) {
  'use strict';
  
  // Taken from: http://webreflection.blogspot.com/2009/01/ellipse-and-circle-for-canvas-2d.html
  function ellipse(g, x, y, width, height) {
    var hB = (width / 2) * .5522848,
        vB = (height / 2) * .5522848,
        eX = x + width,
        eY = y + height,
        mX = x + width / 2,
        mY = y + height / 2;
        
    g.moveTo(x, mY);
    g.bezierCurveTo(x, mY - vB, mX - hB, y, mX, y);
    g.bezierCurveTo(mX + hB, y, eX, mY - vB, eX, mY);
    g.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
    g.bezierCurveTo(mX - hB, eY, x, mY + vB, x, mY);
    g.closePath();
  }
  
  function Sprite(name, layer) {
    // Ownership properties.
    this.name  = name;
    this.layer = layer;
    
    // Positional properties.
    this.position = {x: 0, y: 0};
    this.angle = 0;
    this.size = {x: 40, y: 40}; 
    
    // Drawing properties.
    this.pen = {
      down:     false, 
      color:    micro.graphics.color(0, 0, 0), 
      cssColor: 'rgb(0,0,0)', 
      size:     1
    };
    this.fill = {
      color:    micro.graphics.color(1, 1, 1),
      cssColor: 'rgb(255,255,255)'
    };
    
    // Appearance properties.
    this.scale   = {x: 1, y: 1, both: 1};
    this.visible = true;
    this.skin    = 'arrow';
    this.image   = 'arrow';
    
    // Behaviour / Animation.
    this.userUpdateFunction = null;
    
    this.tileinfo = {width: 0, height: 0};
    this.tile     = 0; // The default tile.
    
    // IDEA:  this.direction = {x: 0, y: 0, angle: 0};
    
    // Other
    this.data = {};
  }
  
  // Sprite rendering...
  Sprite.prototype.update = function (g) {
    var previousCurrentSprite = this.layer.currentSprite;
    
    if (this.userUpdateFunction) {
      this.layer.currentSprite = this;
      this.userUpdateFunction();
      this.layer.currentSprite = previousCurrentSprite;
    }
    
    if (this.visible) {
      g.save();
      
      g.translate(this.position.x, this.position.y);
      g.scale(this.scale.x, this.scale.y);
      g.rotate(-this.angle);
      
      switch (this.image) {
      case 'arrow':
        this.drawArrowSprite(g);
        break;
      
      case 'rectangle':
        this.drawRectangleSprite(g);
        break;
      
      case 'square':
        this.drawSquareSprite(g);
        break;
      
      case 'ellipse':
        this.drawEllipseSprite(g);
        break;
      
      case 'circle':
        this.drawCircleSprite(g);
        break;
      
      case 'pacman':
        this.drawPacManSprite(g);
        break;
        

      case 'ghost':
        this.drawGhostSprite(g);
        break;
        
      default: // An image sprite.
        this.drawImageSprite(g);
        break;
      }
      
      g.restore();
    }
    
    // this.drawDebugInfo(g);
  };
  
  
  Sprite.prototype.drawDebugInfo = function (g) {
    var w = this.size.x * this.scale.x, 
        h = this.size.y * this.scale.y,
        a = this.visible ? 1 : 0.333,
        f = micro.graphics.color(this.fill.color.r, this.fill.color.g, this.fill.color.b, this.fill.color.a * a),
        s = micro.graphics.color(this.pen.color.r, this.pen.color.g, this.pen.color.b, this.pen.color.a * a),
        r = this.pen.size * 2;
    
    if (this.layer.currentSprite === this) {
      g.strokeStyle = 'rgba(255, 0, 0, ' + a + ')';
    } else {
      g.strokeStyle = 'rgba(0, 0, 255, ' + a + ')';
    }
    
    g.save();
    
    g.translate(this.position.x, this.position.y);
    g.beginPath();
    g.moveTo(-5,  0);
    g.lineTo( 5,  0);
    g.moveTo( 0, -5);
    g.lineTo( 0,  5);
    g.stroke();
    
    g.save();
    g.rotate(-this.angle);
    
    g.lineWidth   = 1;
    g.strokeRect(-w / 2, -h / 2, w, h);
    g.restore();
    
    g.fillStyle = g.strokeStyle;
    
    g.scale(1, -1);
    g.textBaseline = 'middle';
    g.font = '12px sans-serif'
    g.fillText(this.name, w / 2 + 3, 0);
    
    g.translate(-w / 2 - 3 - r * 1.5, 0);
    g.fillStyle = f.toCss();
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
    
    g.strokeStyle = s.toCss();
    g.lineWidth = this.pen.size;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
    
    if (this.pen.down) {
      g.rotate(Math.PI);
    }
    
    g.fillStyle = 'black'; //'rgba(0, 0, 0, ' + a + ')';
    g.beginPath();
    g.moveTo( 0, -r * 1.5 - 8);
    g.lineTo( 3, -r * 1.5 - 4);
    g.lineTo(-3, -r * 1.5 - 4);
    g.fill();
    
    g.restore();
  };
  
  
  Sprite.prototype.drawArrowSprite = function (g) {
    var sz = Math.min(this.size.x, this.size.y);
    
    g.scale(sz / 36, sz / 36);
    
    // Arrow outline.
    g.strokeStyle = 'white';
    g.lineWidth   = 5;
    g.beginPath();
    g.moveTo( 10.405, -5.978);
    g.lineTo(  0.000, 12.000);
    g.lineTo(-10.405, -5.978);
    g.stroke();
    
    // Arrow fill.
    g.strokeStyle = 'black';
    g.lineWidth   = 3;
    g.beginPath();
    g.moveTo( 10.405, -5.978);
    g.lineTo(  0.000, 12.000);
    g.lineTo(-10.405, -5.978);
    g.stroke();
    
    // Pen outline.
    g.strokeStyle = 'white';
    g.lineWidth   = 1;
    g.beginPath();
    g.arc(0, 0, 3.5, 0, Math.PI * 2);
    g.stroke();
    
    if (this.pen.down) {
      g.fillStyle = this.pen.cssColor;
      g.beginPath();
      g.arc(0, 0, 3, 0, Math.PI * 2);
      g.fill();
    } else {
      g.strokeStyle = this.pen.cssColor;
      g.beginPath();
      g.arc(0, 0, 2.5, 0, Math.PI * 2);
      g.stroke();
    }
  };
  
  Sprite.prototype.drawImageSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawRectangleSprite = function (g) {
    var w = this.size.x, 
        h = this.size.y;
        
    g.fillStyle = this.fill.cssColor;
    g.fillRect(-w / 2, -h / 2, w, h);
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.strokeRect(-w / 2, -h / 2, w, h);
  };
  
  Sprite.prototype.drawSquareSprite = function (g) {
    var sz = Math.min(this.size.x, this.size.y);
    
    g.fillStyle = this.fill.cssColor;
    g.fillRect(-sz / 2, -sz / 2, sz, sz);
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.strokeRect(-sz / 2, -sz / 2, sz, sz);
  };
  
  Sprite.prototype.drawEllipseSprite = function (g) {
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    ellipse(g, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    g.fill();
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.beginPath();
    ellipse(g, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    g.stroke();
  };
  
  Sprite.prototype.drawCircleSprite = function (g) {
    var r = Math.min(this.size.x, this.size.y) / 2;
    
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
  };
  
  Sprite.prototype.drawPacManSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawGhostSprite = function (g) {
    // TODO
  };
  // ...Sprite rendering
  
  
  // Position...
  Sprite.prototype.getPosition = function () {
    return this.position;
  };
  
  // setPosition(x, y)
  // setPosition(vector(x, y))
  Sprite.prototype.setPosition = function (arg1, arg2) {
    var pos = micro.graphics.vector(arg1, arg2);
    
    if (pos !== null) {
      this.position = pos;
    }
  };
  
  Sprite.prototype.getX = function () {
    return this.position.x;
  };
  
  Sprite.prototype.getY = function () {
    return this.position.y;
  };
  
  Sprite.prototype.setX = function (x) {
    x = +x;
    if (!isNaN(x) && isFinite(x)) {
      this.position.x = x;
    }
  };
  
  Sprite.prototype.setY = function (y) {
    y = +y;
    if (!isNaN(y) && isFinite(y)) {
      this.position.y = y;
    }
  };
  
  // moveTo(x, y)
  // moveTo(vector(x, y))
  Sprite.prototype.moveTo = function (arg1, arg2) {
    var pos = micro.math.vector(arg1, arg2), 
        g   = this.layer.gfx.paper;
    
    if (pos !== null) {
      if (this.pen.down) {
        g.strokeStyle = this.pen.cssColor;
        g.lineWidth   = this.pen.size;
      
        g.beginPath();
          g.moveTo(this.position.x, this.position.y);
          g.lineTo(          pos.x,           pos.y);   
        g.stroke();
      }
      
      this.position = pos;
    }
  };
  
  // moveBy(x, y)
  // moveBy(vector(x, y))
  Sprite.prototype.moveBy = function (arg1, arg2) {
    var pos = micro.math.vector(arg1, arg2);
    
    if (pos !== null) {
      this.moveTo(this.position.x + pos.x, this.position.y + pos.y);
    }
  };
  
  Sprite.prototype.forward = function (m) {
    m = +m;
    
    if (!isNaN(m) && isFinite(m)) {
      this.moveBy(Math.sin(this.angle) * m, Math.cos(this.angle) * m);
    }
  };
  
  Sprite.prototype.back = function (m) {
    this.forward(-m);
  };
  // ...Position
  
  
  // Angle...
  Sprite.prototype.getAngle = function () {
    return micro.math.fromrad(this.angle);
  };
  
  Sprite.prototype.setAngle = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle = micro.math.torad(angle);
    }
  };
  
  // turnTo(targetAngle, maxDelta)
  // turnTo(targetAngle)
  Sprite.prototype.turnTo = function (targetAngle, maxDelta) {
    targetAngle = micro.math.torad(+targetAngle);
    
    if (typeof(maxDelta) !== 'undefined') {
      maxDelta = micro.math.torad(Math.abs(+maxDelta));
    } else {
      maxDelta = Infinity;
    }
    
    if (!(isNaN(targetAngle) || isNaN(maxDelta))) {
      if (isFinite(maxDelta)) {
        // TODO
      } else {
        this.angle = targetAngle;
      }
    }
  };
  
  // lookAt(x, y, maxDelta)
  // lookAt(x, y)
  // lookAt(vector(x, y), maxDelta)
  // lookAt(vector(x, y))
  Sprite.prototype.lookAt = function (arg1, arg2, arg3) {
    var targetX, targetY, targetAngle, maxDelta;
    
    // TODO
    
    if (!(isNaN(targetX) || isNaN(targetY) || isNaN(maxDelta))) {
      this.turnTo(targetAngle, maxDelta);
    }
  };
  
  Sprite.prototype.rotate = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle += micro.math.torad(angle);
    }
  };
  
  Sprite.prototype.rotatecc = function (angle) {
    this.rotate(-angle);
  };
  
  Sprite.prototype.right = Sprite.prototype.rotate;
  Sprite.prototype.left  = Sprite.prototype.rotatecc;
  // ...Angle
  
  // Skin...
  Sprite.prototype.getSkin = function () {
    return this.skin;
  };
  
  Sprite.prototype.setSkin = function (skin) {
    skin = skin.toString();
    
    if (skin) {
      this.skin  = skin;
      this.image = skin;
    }
  };
  // ...Skin
  
  
  // User Update Function...
  Sprite.prototype.getUserUpdateFunction = function () {
    return this.userUpdateFunction;
  }
  
  Sprite.prototype.setUserUpdateFunction = function (fn) {
    if (fn === null) {
      this.userUpdateFunction = null;
    } else if (typeof(fn) === 'function') {
      this.userUpdateFunction = fn;
    }
  };
  // ...User Update Function
  
  
  // Color...
  Sprite.prototype.getPenColor = function () {
    return this.pen.color;
  };
  // setPenColor(r, g, b, a)
  // setPenColor(color(...))
  Sprite.prototype.setPenColor = function (arg1, arg2, arg3, arg4) {
    var c = micro.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.pen.color    = c;
      this.pen.cssColor = c.toCss();
    }
  };
  // ...Color
  
  // Pen Size...
  Sprite.prototype.getPenSize = function () {
    return this.pen.size;
  };
  
  Sprite.prototype.setPenSize = function (size) {
    size = +size;
    
    if (!isNaN(size) && isFinite(size)) {
      this.pen.size = size;
    }
  };
  // ...Pen Size
  
  // Pen up/down...
  Sprite.prototype.isPenDown = function () {
    return this.pen.down;
  };
  
  Sprite.prototype.setPenDown = function (down) {
    this.pen.down = !!down;
  };
  
  Sprite.prototype.penDown = function () {
    this.pen.down = true;
  };
  
  Sprite.prototype.penUp = function () {
    this.pen.down = false;
  };
  // ...Pen up/down  
  
  // Visibility...
  Sprite.prototype.isVisible = function () {
    return this.visible;
  };
  
  Sprite.prototype.setVisible = function (visible) {
    this.visible = !!visible;
  };
  
  Sprite.prototype.show = function () { 
    this.visible = true; 
  };
  
  Sprite.prototype.hide = function () { 
    this.visible = false; 
  };
  // ...Visibility
    
  
  exports.install = function (ns) {
    ns.Sprite = Sprite;
  };
  
  exports.install(exports);
}(micro._));
(function (exports, Sprite) {
  'use strict';
  
  
  function identity(g) {
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  
  function clear(g) {
    g.save();
    identity(g);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.restore();
  }
  
  
  function Layer(name, screen) {
    this.name   = name;
    this.screen = screen;
    
    this.sprites       = {};
    this.currentSprite = null;
    this.nextSpriteId  = 0;
    
    this.els = {
      container: document.createElement('div'),
      paper:     document.createElement('canvas'),
      tiles:     document.createElement('canvas'),
      sprites:   document.createElement('canvas')
    };
    
    this.els.container.setAttribute('class', 'micro-layer');
    this.els.paper.setAttribute('class', 'micro-sublayer');
    this.els.tiles.setAttribute('class', 'micro-sublayer');
    this.els.sprites.setAttribute('class', 'micro-sublayer');
    
    this.els.container.appendChild(this.els.paper);
    this.els.container.appendChild(this.els.tiles);
    this.els.container.appendChild(this.els.sprites);
    
    this.gfx = {
      paper:   this.els.paper.getContext('2d'),
      sprites: this.els.sprites.getContext('2d')
    };
    
    this.onResize();
    
    this.newSprite('default');
    this.sprites['default'].hide();
    this.sprites['default'].penDown();
  };
  
  
  Layer.prototype.update = function () {
    var layer = this;
    
    clear(layer.gfx.sprites);
    
    micro.collections.foreach(function (sprite) {
      sprite.update(layer.gfx.sprites);
    }, layer.sprites);
  };
  
  
  Layer.prototype.generateSpriteName = function () {
    var name;
    
    do {
      name = '<' + this.nextSpriteId + '>';
      
      this.nextSpriteId += 1;
    } while (this.sprites.hasOwnProperty(name));
    
    return name;
  };
  
  
  Layer.prototype.newSprite = function (name) {
    var sprite;
    
    if (typeof(name) === 'undefined') {
      name = this.generateSpriteName();
    }
    
    name = name.toString().toLowerCase();
    
    if (!this.sprites.hasOwnProperty(name) && (name.length > 0)) {
      sprite = new Sprite(name, this);
      this.sprites[name] = sprite;
      
      this.currentSprite = sprite;
      
      return name;
    }
    
    return null;
  };
  
  Layer.prototype.getCurrentSpriteName = function () {
    return this.currentSprite.name;
  };
  
  Layer.prototype.setCurrentSpriteName = function (name) {
    if (typeof(name) !== 'undefined') {
      name = name.toString().toLowerCase();
      if (name.length > 0) {
        if (this.sprites.hasOwnProperty(name)) {
          this.currentSprite = this.sprites[name];
        }
      }
    }
  };
  
  Layer.prototype.onResize = function () {
    var size = this.screen.getSize();
    
    this.els.paper.setAttribute('width',  size.x);
    this.els.paper.setAttribute('height', size.y);
    
    this.els.tiles.setAttribute('width',  size.x);
    this.els.tiles.setAttribute('height', size.y);
    
    this.els.sprites.setAttribute('width',  size.x);
    this.els.sprites.setAttribute('height', size.y);
    
    identity(this.gfx.paper);
    this.gfx.paper.translate(Math.floor(size.x / 2), Math.floor(size.y / 2));
    this.gfx.paper.scale(1, -1);
    
    this.gfx.sprites.setTransform(1, 0, 0, 1, 0, 0);
    this.gfx.sprites.translate(Math.floor(size.x / 2), Math.floor(size.y / 2));
    this.gfx.sprites.scale(1, -1);
  };
  
  exports.install = function (ns) {
    ns.Layer = Layer;
  };
  
  exports.install(exports);
}(micro._, micro._.Sprite));
(function (exports, Layer) {
  'use strict';
  
  function Screen(parent) {
    this.parent = null;
    
    this.config = {
      size:        micro.math.vector(400, 400),
      borderColor: micro.graphics.color(0.5, 0.5, 0.5),
      pageColor:   micro.graphics.color(0.5, 0.5, 0.5)
    };
    
    this.layers = {
      lookup:  {},
      order:   [],
      current: null
    };
    
    this.els = {
      border: document.createElement('div'),
      page:   document.createElement('div')
    };
    
    this.els.border.setAttribute('class', 'micro-border');
    this.els.page.setAttribute('class', 'micro-page');    
    
    this.els.border.appendChild(this.els.page);
    
    this.setBorderColor(this.config.borderColor);
    this.setPageColor(this.config.pageColor);
    
    this.setSize(this.config.size);
    
    if (parent) {
      this.setParent(parent);
    }
    
    this.newLayer('default');
  }
  
  Screen.prototype.update = function () {
    var screen = this;
    micro.collections.foreach(function (layer) {
      layer.update();
    }, screen.layers.order);
  };
  
  // Config...
  Screen.prototype.getParent = function () {
    return this.parent;
  };
  
  Screen.prototype.setParent = function (parent) {
    if (this.parent) {
      this.parent.removeChild(this.els.border);
    }
    
    parent.appendChild(this.els.border);
    
    this.parent = parent;
  };
  
  
  Screen.prototype.getSize = function () {
    return this.config.size;
  };
  
  // setSize(width, height)
  // setSize(vector(...))
  Screen.prototype.setSize = function (arg1, arg2) {
    var self = this, v = micro.math.vector(arg1, arg2);
    
    if (v !== null) {
      this.config.size = v;
      
      this.els.page.style.width  = v.x + 'px';
      this.els.page.style.height = v.y + 'px';
      
      this.els.page.style.marginLeft = -v.x / 2 + 'px';
      this.els.page.style.marginTop  = -v.y / 2 + 'px';
      
      micro.collections.foreach(function (layer) { 
        layer.onResize(); 
      }, self.layers.order);
    }
  };
  
  Screen.prototype.getBorderColor = function () {
    return this.config.borderColor;
  };
  
  // setBorderColor(r, g, b, a)
  // setBorderColor(color(...))
  Screen.prototype.setBorderColor = function (arg1, arg2, arg3, arg4) {
    var c = micro.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.borderColor          = c;
      this.els.border.style.background = c.toCss();
    }
  };
  
  
  Screen.prototype.getPageColor = function () {
    return this.config.pageColor;
  };
  
  // setPageColor(r, g, b, a)
  // setPageColor(color(...))
  Screen.prototype.setPageColor = function (arg1, arg2, arg3, arg4) {
    var c = micro.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.pageColor          = c;
      this.els.page.style.background = c.toCss();
    }
  };
  // ...Config
  
  
  // Layers...
  Screen.prototype.newLayer = function (name) {
    var layer;
    
    name = name.toLowerCase();
    
    if (!this.layers.lookup.hasOwnProperty(name)) {
      layer = new Layer(name, this);
      
      this.layers.lookup[name] = layer;
      this.layers.order.push(layer);
      
      this.els.page.appendChild(layer.els.container);
      
      if (this.layers.current === null) {
        this.layers.current = layer;
      }
    }
    
    return layer.name;
  };
  // ...Layers
  
  exports.install = function (ns) {
    ns.Screen = Screen;
  };
  
  exports.install(exports);
}(micro._, micro._.Layer));
(function (exports) {
  'use strict';
  
  var tilesets = {};
  
  
  function wrapIndex(index, bound) {
    if (index >= 0) {
      index = index % bound;
    } else {
      // TODO:  This works but I'm sure it could be simplified.
      index = (bound - (Math.abs(index) % bound)) % bound;
    }
    
    return index;
  } 
  
  
  function TileSet(name) {
    this.tiles = 1;
  }
  
  // drawTile(x : number, y : number, w : number, h : number, index : number)
  // drawTile(pos: vector, w : number, h : number, index : number)
  // drawTile(x : number, y : number, size: vector, index : number)
  // drawTile(pos: vector, size : vector, index : number)
  // drawTile(pos: vector, index)
  // drawTile(index)
  TileSet.prototype.drawTile = function (arg1, arg2, arg3, arg4, arg5) {
    var x, y, w, h, index;
    
    if (typeof(arg5) !== 'undefined') {
      x     = +arg1;
      y     = +arg2;
      w     = +arg3;
      h     = +arg4;
      index = Math.floor(+arg5);
    }
    
    if (!(isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || isNaN(index))) {
      index = wrapIndex(index, this.tiles);
      if (isFinite(x) && isFinite(y) && isFinite(w) && isFinite(h) && isFinite(index)) {
        if ((w >= 0) && (h >= 0)) {
          // Render
        }
      }
    }
  };
  
  
  exports.install = function (ns) {
    ns.newtileset = function (name) {
    };
    
    ns.drawtile = function (name, arg1, arg2, arg3, arg4, arg5) {
    };
  };
  
  exports.install(exports);
}(micro.graphics));
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
/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */

/*
    TODO:
     *  State stack.
     *  Loading state.
     *  Play / Pause.
     *  Frame rate control.
 */

    
(function (exports, _) {
  'use strict';
 
  var loadingOverlay, state, mainloop, loadingJobs = 0, loopCallbacks = [];
  
  function loadScript(src, callback) {
    var scriptEl = document.createElement('script');
    
    scriptEl.onload  = callback;
    scriptEl.src     = src;
    
    document.head.appendChild(scriptEl);
  }
  
  
  function StateManager() {
    this.stack = [];
  }
  
  StateManager.prototype.push = function (statename) {
    this.stack.push(statename.toString());
    this.init();
  };
  
  StateManager.prototype.pop = function () {
  };
  
  StateManager.prototype.set = function () {
  };
  
  StateManager.prototype.init = function () {
    var state    = this.stack[this.stack.length - 1],
        initName = 'init';
    
    if (state) {
      initName += '_' + state;
    }
    
    if (typeof(window[initName]) === 'function') {
      window[initName]();
    }
  };
  
  StateManager.prototype.enter = function () {
    
  };
  
  StateManager.prototype.update = function () {
    // Updates the top-most state.
    var state      = this.stack[this.stack.length - 1],
        updateName = 'update';
    
    if (state) {
      updateName += '_' + state;
    }
    
    if (typeof(window[updateName]) === 'function') {
      window[updateName]();
    }
  };
  
  StateManager.prototype.leave = function () {
    // When control leaves the a state.
  };
  
  StateManager.prototype.term = function () {
    // When a state is poped of the stack.
  };
  
  function IntervalMainLoop(loopCallbacks) {
    this.running       = false;
    this.fps           = 30;
    this.interval      = null;
    this.loopCallbacks = loopCallbacks;
    this.loadtasks     = 0;
  }
  
  IntervalMainLoop.prototype.setFps = function (fps) {
    fps = +fps;
    
    if ((this.fps !== fps) && (fps > 0)) {
      this.fps = fps;
      
      if (this.running) {
        this.stop();
        this.start();
      }
    }
  };
  
  
  IntervalMainLoop.prototype.startloadtask = function () {
    if (this.loadtasks === 0) {
      loadingOverlay.style.display = 'block';
    }
    
    this.loadtasks += 1;
  };
  
  
  IntervalMainLoop.prototype.endloadtask = function () {
    this.loadtasks = Math.max(0, this.loadtasks - 1);
    
    if (this.loadtasks === 0) {
      loadingOverlay.style.display = 'none';
    }
  };
  
  
  
  IntervalMainLoop.prototype.getFps = function () {
    return this.fps;
  };
  
  IntervalMainLoop.prototype.start = function () {
    var self = this;
    
    if (!this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
      }
      
      this.interval = window.setInterval(function () {
        if (self.loadtasks === 0) {
          foreach(function (callback) {
            callback();
          }, self.loopCallbacks);
        }
      }, 1000 / this.fps);
      this.running  = true;
    }
  };
  
  IntervalMainLoop.prototype.stop = function () {
    if (this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = null;
      }
      
      this.running = false;
    }
  };
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      title: {
        get: function () {
          return document.title;
        },
        set: function (title) {
          document.title = title;
        }
      },
      
      fps: {
        get: function () {
          return mainloop.getFps();
        },
        set: function (fps) {
          mainloop.setFps(fps);
        }
      }
    });
    
    Object.defineProperties(ns, {
      pushstate: {
        value: function () {
        }
      },
      
      popstate: {
        value: function () {
        }
      },
      
      changestate: {
        value: function () {
        }
      }
    });
    
    Object.defineProperties(ns, {
      startloadtask: {
        value: function () {
          mainloop.startloadtask();
        }
      },
      
      endloadtask: {
        value: function () {
          mainloop.endloadtask();
        }
      }
    });
    
    
    ns.start = function () {
      mainloop.start();
    };
    
    
    ns.stop = function () {
      mainloop.stop();
    };
    
    
    ns.__onloadhandler = function (flatten, mainScript) {
      return function () {
        _.graphicsOnLoad(document.body);
        
        if (flatten) {
          micro.types.install(window);
          micro.string.install(window);
          micro.collections.install(window);
          micro.math.install(window);
          micro.graphics.install(window);
          micro.app.install(window);
          micro.sound.install(window);
        }
        
        loadingOverlay = document.createElement('div');
        loadingOverlay.innerHTML = 'Loading...';
        loadingOverlay.style.display = '';
        
        loadingOverlay.setAttribute('class',     'micro-loading-overlay');
        loadingOverlay.setAttribute('className', 'micro-loading-overlay');
        
        document.body.appendChild(loadingOverlay);
        
        state = new StateManager();
        mainloop = new IntervalMainLoop([
            function () { state.update.call(state); }, 
            _.graphicsUpdate
        ]);
        mainloop.startloadtask();
        mainloop.start();
        
        window.clearInterval(window.__titleAnimation__);
        micro.app.title = 'Untitled Application';
        loadScript(mainScript, function () {
          state.push(''); // The default state.
          mainloop.endloadtask();
        });
      };
    };
  };
  
  exports.install(exports);
}(micro.app, micro._));
(function () {
  delete micro._;

  Object.freeze(window.micro            );
  Object.freeze(window.micro.app        );
  Object.freeze(window.micro.collections);
  Object.freeze(window.micro.graphics   );
  Object.freeze(window.micro.input      );
  Object.freeze(window.micro.math       );
  Object.freeze(window.micro.music      );
  Object.freeze(window.micro.sound      );
  Object.freeze(window.micro.string     );
  Object.freeze(window.micro.types      );
}());

