/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */

var micro          = micro || {};
    micro.graphics = micro.graphics || {};
    
(function (exports) {
  'use strict';
  
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
      // 1 argument, should be a color like object or color name.
      
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
    ns.color = color;
  };
  
  exports.install(exports);
}(micro.graphics));
