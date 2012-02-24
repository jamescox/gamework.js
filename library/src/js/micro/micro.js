(function () {
  var module = {};
  
  module._ = {};
  
  module.app         = {};
  module.collections = {};
  module.graphics    = {};
  module.input       = {};
  module.math        = {};
  module.music       = {};
  module.sound       = {};
  module.string      = {};
  module.types       = {};
  
  Object.defineProperty(window, 'micro', {value: module, enumerable: true});
}());
