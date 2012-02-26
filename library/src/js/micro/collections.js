/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

/*
    TODO:
     *  Add first, second, third, etc. & rest (a-la Common LISP).
     *  Add last & butlast (a-la Common LISP).
     *  Add zip
 */


(function (exports) {
  'use strict';

  exports.install = function (ns) {
    ns.foreach = function (fn, col) {
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
    };

      
    ns.map = function (fn, col) {
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
    };
      
      
    ns.reduce = function (fn, a, col) {
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
    };

      
    ns.filter = function (p, col) {
      var ret, key, i, coltype = micro.types.gettype(col);
      
      if (coltype === 'string') {
        ret = '';
        for (i = 0; i < col.length; i += 1) {
          if (p(col[i])) {
            ret += col[i];
          }
        }
      } else if (coltype === 'array') {
        ret = [];
        for (i = 0; i < col.length; i += 1) {
          if (p(col[i])) {
            ret.push(col[i]);
          }
        }
      } else if (coltype === 'object') {
        ret = {};
        for (key in col) {
          if (col.hasOwnProperty(key)) {
            if (p(col[key])) {
              ret[key] = col[key];
            }
          }
        }
      }
      
      return ret;
    };

    
    ns.makearray = function (/* initializerfn, dim1, dim2... */) {
      var i, dims = Array.prototype.slice.call(arguments, 1), idxs = [];
  
      function makeArray(initfn, dims, idxs) {
        var i, array = [];
        
        if (dims.length == 1) {
          for (i = 0; i < dims[0]; i += 1) {
            array.push(initfn.apply(this, idxs.concat([i])));
          }
        } else if (dims.length > 1) {
          for (i = 0; i < dims[0]; i += 1) {
            array.push(makeArray(initfn, dims.slice(1), idxs.slice(1).concat([i])));
          }
        }
        
        return array;
      }
      
      if (arguments.length >= 2) {
        for (i = 0; i < dims.length - 1; i += 1) {
          idxs.push(0);
        }
        
        return makeArray(arguments[0], dims, idxs);
      }
    };
    
    ns.makezeroarray = function (/* dim1, dim2... */) {
      var args = Array.prototype.slice.call(arguments);
      
      function makezero() { return 0; }
      
      return micro.collections.makearray.apply(this, [makezero].concat(args));
    };
    
    ns.makenullarray = function (/* dim1, dim2... */) {
      var args = Array.prototype.slice.call(arguments);
      
      function makenull() { return null; }
      
      return micro.collections.makearray.apply(this, [makenull].concat(args));
    };
    
    
    ns.len = function (col) {
      var coltype = micro.types.gettype(col);
      
      if ((coltype === 'string') || (coltype === 'array')) {
        return col.length;
      } else if (coltype === 'object') {
        return micro.collections.reduce(function (a) { 
          return a + 1; 
        }, 0, col);
      }
    };
      
    ns.keys = function (col) {
      var key, coltype = micro.types.gettype(col), keys = [];
      
      if ((coltype === 'array') || (coltype === 'string')) {
        return micro.collections.makearray(micro.math.identity, col.length);
      } else if (coltype === 'object') {
        for (key in col) {
          if (col.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
      }
      
      return keys;
    };
      
    ns.values = function (col) {
      var key, coltype = micro.types.gettype(col), values = [];
      
      if ((coltype === 'array') || (coltype === 'string')) {
        return col.slice();
      } else if (coltype === 'object') {
        for (key in col) {
          if (col.hasOwnProperty(key)) {
            values.push(col[key]);
          }
        }
      }
      
      return values;
    };
    
    // Predicates
    ns.isempty = function (col) { 
      return micro.collections.len(col) === 0; 
    };
    
    ns.haskey = function (col, key) { 
      return micro.collections.keys(col).indexOf(key) !== -1;
    };
    
    ns.contains = function (col, value) {
      return micro.collections.values(col).indexOf(value) !== -1;
    };
  };
              
  exports.install(exports);
}(micro.collections)); 
