/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

/*
   TODO:
    *  Perhapse add 'regex' to the gettype return values.
    *  Change definition in istall to attribute assignment.
 */

var micro       = micro || {};
    micro.types = micro.types || {};

(function (exports) {
  'use strict';
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      gettype: {
        value: function (value) {
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
        }
      }
    });
    
    Object.defineProperties(ns, {
      isarray: {
        value: function (value) {
          return micro.types.gettype(value) === 'array';
        }
      },
      
      isboolean: {
        value: function (value) {
          return micro.types.gettype(value) === 'boolean';
        }
      },
      
      isfunction: {
        value: function (value) {
          return micro.types.gettype(value) === 'function';
        }
      },
      
      isnull: {
        value: function (value) {
          return micro.types.gettype(value) === 'null';
        }
      },
      
      isnumber: {
        value: function (value) {
          return micro.types.gettype(value) === 'number';
        }
      },
      
      isobject: {
        value: function (value) {
          return micro.types.gettype(value) === 'object';
        }
      },
      
      isstring: {
        value: function (value) {
          return micro.types.gettype(value) === 'string';
        }
      },
      
      isundefined: {
        value: function (value) {
          return micro.types.gettype(value) === 'undefined';
        }
      }
    });
  };

  exports.install(exports);
}(micro.types));
