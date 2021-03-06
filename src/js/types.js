/*jslint browser: true, white: true, maxerr: 50, indent: 2 */

(function (exports) {
  'use strict';
  
  exports.install = function (ns) {
    ns.gettype = function (value) {
      var type = typeof(value);
      
      if (type === 'object') {
        if (value) {
          //if (value instanceof Array) {
          if (Object.prototype.toString.call(value) === '[object Array]') {
            return 'array';
          }
        } else {
          return 'null';
        }
      }
      
      return type;
    };
      
    
    ns.isarray = function (value) {
      return gamework.types.gettype(value) === 'array';
    };
    
    ns.isboolean = function (value) {
      return gamework.types.gettype(value) === 'boolean';
    };
    
    ns.isfunction = function (value) {
      return gamework.types.gettype(value) === 'function';
    };
    
    ns.isnull = function (value) {
      return gamework.types.gettype(value) === 'null';
    };
    
    ns.isnumber = function (value) {
      return gamework.types.gettype(value) === 'number';
    };
    
    ns.isobject = function (value) {
      return gamework.types.gettype(value) === 'object';
    };
    
    ns.isstring = function (value) {
      return gamework.types.gettype(value) === 'string';
    };
    
    ns.isundefined = function (value) {
      return gamework.types.gettype(value) === 'undefined';
    };
  };

  exports.install(exports);
}(gamework.types));
