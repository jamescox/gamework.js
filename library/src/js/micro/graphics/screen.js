var micro            = micro || {};
    micro.__graphics = micro.__graphics || {};

(function (exports) {
  'use strict';
  
  function Screen(parent) {
    this.parent = null;
    
    this.config = {
      size:        micro.math.vector(400, 400),
      borderColor: micro.graphics.color(0.5, 0.5, 0.5),
      pageColor:   micro.graphics.color(0.5, 0.5, 0.5)
    };
    
    this.layers = {
      lookup:  {},
      order:   [],
      current: null
    };
    
    this.els = {
      border: document.createElement('div'),
      page:   document.createElement('div')
    };
    
    this.els.border.setAttribute('class', 'micro-border');
    this.els.page.setAttribute('class', 'micro-page');    
    
    this.els.border.appendChild(this.els.page);
    
    this.setBorderColor(this.config.borderColor);
    this.setPageColor(this.config.pageColor);
    
    this.setSize(this.config.size);
    
    if (parent) {
      this.setParent(parent);
    }
    
    this.newLayer('default');
  }
  
  Screen.prototype.update = function () {
    var screen = this;
    micro.collections.foreach(function (layer) {
      layer.update();
    }, screen.layers.order);
  };
  
  // Config...
  Screen.prototype.getParent = function () {
    return this.parent;
  };
  
  Screen.prototype.setParent = function (parent) {
    if (this.parent) {
      this.parent.removeChild(this.els.border);
    }
    
    parent.appendChild(this.els.border);
    
    this.parent = parent;
  };
  
  
  Screen.prototype.getSize = function () {
    return this.config.size;
  };
  
  // setSize(width, height)
  // setSize(vector(...))
  Screen.prototype.setSize = function (arg1, arg2) {
    var v = micro.math.vector(arg1, arg2);
    
    if (v !== null) {
      this.config.size = v;
      
      this.els.page.style.width  = v.x + 'px';
      this.els.page.style.height = v.y + 'px';
      
      this.els.page.style.marginLeft = -v.x / 2 + 'px'
      this.els.page.style.marginTop  = -v.y / 2 + 'px'
    }
  };
  
  Screen.prototype.getBorderColor = function () {
    return this.config.borderColor;
  };
  
  // setBorderColor(r, g, b, a)
  // setBorderColor(color(...))
  Screen.prototype.setBorderColor = function (arg1, arg2, arg3, arg4) {
    var c = micro.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.borderColor          = c;
      this.els.border.style.background = c.toCss();
    }
  };
  
  
  Screen.prototype.getPageColor = function () {
    return this.config.pageColor;
  };
  
  // setPageColor(r, g, b, a)
  // setPageColor(color(...))
  Screen.prototype.setPageColor = function (arg1, arg2, arg3, arg4) {
    var c = micro.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.pageColor          = c;
      this.els.page.style.background = c.toCss();
    }
  };
  // ...Config
  
  
  // Layers...
  Screen.prototype.newLayer = function (name) {
    var layer;
    
    name = name.toLowerCase();
    
    if (!this.layers.lookup.hasOwnProperty(name)) {
      layer = new micro.__graphics.Layer(name, this);
      
      this.layers.lookup[name] = layer;
      this.layers.order.push(layer);
      
      this.els.page.appendChild(layer.els.container);
      
      if (this.layers.current === null) {
        this.layers.current = layer;
      }
    }
    
    return layer.name;
  };
  // ...Layers
  
  exports.install = function (ns) {
    ns.Screen = Screen;
  };
  
  exports.install(exports);
}(micro.__graphics));
