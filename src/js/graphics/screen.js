(function (exports) {
  'use strict';
  
  function Screen(parent) {
    this.parent = null;
    
    this.config = {
      size:        gamework.math.vector(400, 400),
      borderColor: gamework.graphics.color(0.55, 0.55, 0.55),
      pageColor:   gamework.graphics.color(0.50, 0.50, 0.50)
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
    
    this.els.border.setAttribute('class', 'gw-screen');
    this.els.page.setAttribute('class', 'gw-page');    
    
    this.els.border.appendChild(this.els.page);
    
    this.setBorderColor(this.config.borderColor);
    this.setPageColor(this.config.pageColor);
    
    this.setSize(this.config.size);
    
    if (parent) {
      this.setParent(parent);
    }
    
    exports.inputHook(window, this.els.border);
    
    this.newLayer('default');
  }
  
  Screen.prototype.update = function () {
    var screen = this;
    gamework.collections.foreach(function (layer) {
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
    var self = this, v = gamework.math.vector(arg1, arg2);
    
    if (v !== null) {
      this.config.size = v;
      
      this.els.page.style.width  = v.x + 'px';
      this.els.page.style.height = v.y + 'px';
      
      this.els.page.style.marginLeft = -v.x / 2 + 'px';
      this.els.page.style.marginTop  = -v.y / 2 + 'px';
      
      gamework.collections.foreach(function (layer) { 
        layer.onResize(); 
      }, self.layers.order);
    }
  };
  
  Screen.prototype.getBorderColor = function () {
    return this.config.borderColor;
  };
  
  // setBorderColor(r, g, b, a)
  // setBorderColor(color(...))
  Screen.prototype.setBorderColor = function (arg1, arg2, arg3, arg4) {
    var c = gamework.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.borderColor          = c;
      this.els.border.style.background = c.tocss();
    }
  };
  
  
  Screen.prototype.getPageColor = function () {
    return this.config.pageColor;
  };
  
  // setPageColor(r, g, b, a)
  // setPageColor(color(...))
  Screen.prototype.setPageColor = function (arg1, arg2, arg3, arg4) {
    var c = gamework.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.config.pageColor          = c;
      this.els.page.style.background = c.tocss();
    }
  };
  // ...Config
  
  
  // Layers...
  Screen.prototype.recalcLayersZ = function () {
    var i;
    
    for (i = 0; i < this.layers.order.length; i += 1) {
      this.layers.order[i].z = i;
    }
  }
  
  Screen.prototype.newLayer = function (name, aboveBelow) {
    var i, layer, nameCi;
    
    if (typeof(aboveBelow) === 'undefined') {
      aboveBelow = 'above';
    } else {
      aboveBelow = aboveBelow.trim().toLowerCase();
      if ((aboveBelow !== 'above') && (aboveBelow !== 'below')) {
        return '';
      }
    }
    
    name = exports.validateId(name);
    nameCi = name.toLowerCase();
    
    if (name !== '') {
      if (!this.layers.lookup.hasOwnProperty(nameCi)) {
        layer = new exports.Layer(name, this);
        
        this.layers.lookup[nameCi] = layer;
        
        if (this.layers.current) {
          if (aboveBelow === 'above') {
            if (this.layers.current.els.container.nextSibling) {
              this.els.page.insertBefore(
                layer.els.container, 
                this.layers.current.els.container.nextSibling);
            } else {
              this.els.page.appendChild(layer.els.container);
            }
            this.layers.order.splice(this.layers.current.z + 1, 0, layer);
          } else {
            this.els.page.insertBefore(
              layer.els.container, 
              this.layers.current.els.container);
              
            this.layers.order.splice(this.layers.current.z, 0, layer);
          }
        } else { 
          // First layer (default).
          this.els.page.appendChild(layer.els.container);
          this.layers.order.push(layer);
        }

        this.layers.current = layer;
        
        this.recalcLayersZ();
      } else {
        name = '';
      }
    }
    
    return name;
  };
  
  Screen.prototype.removeLayer = function (name) {
    var nameCi, layer;
    
    if (this.layers.order.length > 1) {
      if (typeof(name) === 'undefined') {
        name = this.layers.current.name;
      } else {
        name = exports.validateId(name);
      }
      
      nameCi = name.toLowerCase();
      
      if (this.layers.lookup.hasOwnProperty(nameCi)) {
        layer = this.layers.lookup[nameCi];
        
        delete this.layers.lookup[nameCi];
        this.layers.order.splice(layer.z, 1);
        
        this.els.page.removeChild(layer.els.container);
        
        this.recalcLayersZ();
        
        if (this.layers.current === layer) {
          this.layers.current = this.layers.order[
            gamework.math.bound(0, layer.z, this.layers.order.length - 1)];
        }
      } else {
        name = '';
      }
    } else {
      name = '';
    }
    
    return name;
  };
  
  Screen.prototype.getLayersByName = function () {
    var self = this;
    
    return map(function (layer) { return layer.name; }, self.layers.order);
  };
  
  Screen.prototype.getCurrentLayer = function () {
    return this.layers.current;
  };
  
  Screen.prototype.setCurrentLayer = function (layer) {
    if (gamework.collections.contains(this.layers.order, layer)) {
      this.layers.current = layer;
    }
  };
  
  Screen.prototype.setCurrentLayerByName = function (name) {
    name = exports.validateId(name).toLowerCase();
    
    if (this.layers.lookup.hasOwnProperty(name)) {
      this.layers.current = this.layers.lookup[name];
    }
  };
  
  Screen.prototype.getLayerCount = function () {
    return this.layers.order.length;
  };
  // ...Layers
  
  exports.install = function (ns) {
    ns.Screen = Screen;
  };
  
  exports.install(exports);
}(gamework.internal));
