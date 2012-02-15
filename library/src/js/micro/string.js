var micro = micro || {};
    micro.string = micro.string || {};
    
(function (exports) {
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

