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
  
}(gamework.string));

