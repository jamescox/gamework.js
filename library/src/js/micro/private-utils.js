(function (exports) {
  exports.validateId = function (id) {
    if (typeof(id) !== 'string') {
      return '';
    }
    
    id = id.trim().split(/\s+/).join('_');
    
    if (id.match(/^[a-zA-Z_$][0-9a-zA-Z-_$]*$/)) {
      return id;
    } else {
      return '';
    }
  };
}(micro._));
