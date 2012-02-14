/*  
    TODO:  
     *  Add maths predicates.
     *  Implement mode.
     *  Implement median.  
     *  Add custom RNG to support seeding.
     *  Add vector math functions.
     *  JSLint this module.
 */

var micro      = micro || {};
    micro.math = micro.math || {};

(function (exports) {
  var SCALE_RAD  = 1.0,
      SCALE_DEG  = Math.PI / 180,
      SCALE_REV  = Math.PI * 2,
      angleUnit  = 'deg',
      angleScale = SCALE_DEG;
      

  exports.install = function (ns) {
    // Constants.
    ns.pi = Math.PI;
    ns.tau = Math.PI * 2;
    
    
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
        }
      },
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
      return Math.atan(t) * angleScale;
    };
      
    ns.arctan2 = function (x, y) {
      return Math.atan2(y, x) * angleScale;
    };
    
    
    // Exponents, powers and roots.  
    ns.exp   = Math.exp;
    ns.log   = Math.log;
    ns.log10 = function (n) { return Math.log(n) / Math.log(10); };
    ns.pow   = Math.pow;
    ns.sqrt  = Math.sqrt;
      
    
    // Rounding.
    ns.int   = Math.floor;
    ns.round = Math.round;
    ns.cint  = Math.ceil;
      
    
    // Radom number generation.
    ns.random = function (/* [upper=1 | lower=0, upper=1] */) {
      var lower = 0, upper = 1;
      
      if (arguments.length === 1) {
        upper = Math.floor(arguments[0]);
      } else if (arguments.length > 1) {
        lower = Math.floor(arguments[0]);
        upper = Math.floor(arguments[1]);
      }
      
      return lower + Math.random() * (upper - lower);
    };
      
    ns.randomint = function (/* [upper=1 | lower=0, upper=1] */) {
      var lower = 0, upper = 2;
      
      if (arguments.length === 1) {
        upper = Math.floor(arguments[0]) + 1;
      } else if (arguments.length > 1) {
        lower = Math.floor(arguments[0]);
        upper = Math.floor(arguments[1]) + 1;
      }
      
      return lower + Math.floor(Math.random() * upper);
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
