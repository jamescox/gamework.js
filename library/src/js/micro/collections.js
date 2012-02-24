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
