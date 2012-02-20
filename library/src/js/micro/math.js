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

var micro      = micro || {};
    micro.math = micro.math || {};

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
        }
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
