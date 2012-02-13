/*  
    TODO:  
     *  Add maths predicates.
     *  Implement mode.
     *  Implement median.  
     *  Add custom RNG to support seeding.
     *  Add vector math functions.
 */

var micro      = micro || {};
    micro.math = micro.math || {};

(function (exports) {
  var angleScale = Math.PI / 180;

  exports.install = function (ns) {
    // Constants.
    Object.defineProperties(ns, {
      pi: {
        value: Math.PI
      },
      
      tau: {
        value: Math.PI * 2
      }
    });
    

    // Trigonometry.
    Object.defineProperties(ns, {
      angleunits: {
        get: function () {
          return angleScale === 1.0 ? 'rad' : 'deg';
        },
        set: function (unit) {
          unit = unit.toLowerCase().substring(0, 3);
          
          if (unit === 'rad') {
            angleScale = 1.0;
          } else if (unit === 'deg') {
            angleScale = Math.PI / 180;
          }
        }
      },
      
      sin: {
        value: function (a) {
          return Math.sin(a * angleScale);
        }
      },

      cos: {
        value: function (a) {
          return Math.cos(a * angleScale);
        }
      },

      tan: {
        value: function (a) {
          return Math.tan(a * angleScale);
        }
      },
      
      arctan: {
        value: function (t) {
          return Math.atan(t) * angleScale;
        }
      },
      
      arctan2: {
        value: function (x, y) {
          return Math.atan2(y, x) * angleScale;
        }
      }
    });
    
    
    // Exponents, powers and roots.  
    Object.defineProperties(ns, {  
      exp: {
        value: Math.exp
      },
      
      log: {
        value: Math.log
      },
      
      log10: {
        value: function (n) {
          return Math.log(n) / Math.log(10);
        }
      },
      
      pow: {
        value: Math.pow
      },
      
      sqrt: {
        value: Math.sqrt
      }
    });
      
    
    // Rounding.
    Object.defineProperties(ns, {
      int: {
        value: Math.floor
      },
      
      round: {
        value: Math.round
      },
      
      cint: {
        value: Math.ceil
      }
    });
      
    
    // Radom number generation.
    Object.defineProperties(ns, {
      
      random: {
        value: function (/* [upper=1 | lower=0, upper=1] */) {
          var lower = 0, upper = 1;
          
          if (arguments.length === 1) {
            upper = Math.floor(arguments[0]);
          } else if (arguments.length > 1) {
            lower = Math.floor(arguments[0]);
            upper = Math.floor(arguments[1]);
          }
          
          return lower + Math.random() * (upper - lower);
        }
      },
      
      randomint: { 
        value: function (/* [upper=1 | lower=0, upper=1] */) {
          var lower = 0, upper = 2;
          
          if (arguments.length === 1) {
            upper = Math.floor(arguments[0]) + 1;
          } else if (arguments.length > 1) {
            lower = Math.floor(arguments[0]);
            upper = Math.floor(arguments[1]) + 1;
          }
          
          return lower + Math.floor(Math.random() * upper);
        }
      },
      
      randompick: {
        value: function (col) {
          var keys, coltype = micro.types.gettype(col);
          
          if ((coltype === 'string') || (coltype === 'array')) {
            return col[micro.math.randomint(col.length - 1)];
          } else if (coltype === 'object') {
            keys = micro.collections.keys(col);
            
            return keys[micro.math.randomint(keys.length - 1)];
          }
        }
      }
    });
    
    // Collections
    Object.defineProperties(ns, {
      min: {
        value: Math.min
      },
      
      max: {
        value: Math.max
      },
      
      sum: {
        value: function (/* [collection<number> | number...] */) {
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
        }
      },
      
      mean: {
        value: function (/* [collection<number> | number...] */) {
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
        }
      }
    });
    
    // Misc.
    Object.defineProperties(ns, {
      abs: {
        value: Math.abs
      },
      
      normal: {
        value: function (n) {
          return n === 0 ? 0 : n / micro.math.abs(n);
        }
      }
    });
  };
  
  exports.install(exports);
}(micro.math));
