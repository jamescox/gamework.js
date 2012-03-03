(function () {
  var module = {};
  
  module._ = {};
  
  module.game        = {};
  module.collections = {};
  module.graphics    = {};
  module.input       = {};
  module.math        = {};
  module.music       = {};
  module.sound       = {};
  module.string      = {};
  module.types       = {};
  
  Object.defineProperty(window, 'gamework', {value: module, enumerable: true});
}());
