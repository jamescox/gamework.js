(function (exports) {
  'use strict';
  
  
  function identity(g) {
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  
  function clear(g) {
    g.save();
    identity(g);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.restore();
  }
  
  
  function Layer(name, screen) {
    this.name   = name;
    this.screen = screen;
    
    this.sprites       = {};
    this.currentSprite = null;
    this.nextSpriteId  = 0;
    
    this.els = {
      container: document.createElement('div'),
      paper:     document.createElement('canvas'),
      tiles:     document.createElement('canvas'),
      sprites:   document.createElement('canvas')
    };
    
    this.els.container.setAttribute('id', 'layer-' + name);
    this.els.container.setAttribute('class', 'gw-layer');
    this.els.paper.setAttribute('class', 'gw-sublayer');
    this.els.tiles.setAttribute('class', 'gw-sublayer');
    this.els.sprites.setAttribute('class', 'gw-sublayer');
    
    this.els.container.appendChild(this.els.paper);
    this.els.container.appendChild(this.els.tiles);
    this.els.container.appendChild(this.els.sprites);
    
    this.gfx = {
      paper:   this.els.paper.getContext('2d'),
      sprites: this.els.sprites.getContext('2d')
    };
    
    this.onResize();
    
    this.newSprite('default');
    this.sprites['default'].hide();
    this.sprites['default'].penDown();
  };
  
  
  // Z-Order...
  Layer.prototype.getZ = function () {
    return this.z;
  };
  
  Layer.prototype.setZ = function (z) {
    var nextLayer,
        lastLayerIdx = this.screen.getLayerCount() - 1;
 
    if (!isNaN(z)) {
      z = gamework.math.bound(0, +z, lastLayerIdx);
      
      if (z !== this.z) {
        nextLayer = this.screen.layers.order[z + 1];
      
        this.screen.layers.order.splice(this.z, 1);
        this.screen.els.page.removeChild(this.els.container);
      
        if (z === 0) {
          // Move to the top.
          this.screen.els.page.insertBefore(
            this.els.container, this.screen.els.page.firstChild);
          this.screen.layers.order.unshift(this);
        } else if (z === lastLayerIdx) {
          // Move to the bottom.
          this.screen.els.page.appendChild(this.els.container);
          this.screen.layers.order.push(this);
        } else {
          this.screen.els.page.insertBefore(
            this.els.container, nextLayer.els.container);
          this.screen.layers.order.splice(z, 0, this);
        }
      
        this.screen.recalcLayersZ();
      }
    }
  };
  
  
  Layer.prototype.rename = function (name) {
    var nameCi;
    
    name   = exports.validateId(name);
    nameCi = name.toLowerCase();
    
    if ((name !== '') && !this.screen.layers.lookup.hasOwnProperty(nameCi)) {
      delete this.screen.layers.lookup[this.name.toLowerCase()];
      
      this.screen.layers.lookup[nameCi] = this;
      
      this.name = name;
      
      this.els.container.setAttribute('id', 'layer-' + name);
    }
    
    return this.name;
  };
  
  
  Layer.prototype.toBottom = function () {
    this.setZ(0);
    
    return this.z;
  };
    
  Layer.prototype.moveDown = function (by) {
    if (typeof(by) === 'undefined') {
      by = 1;
    }
    
    if (isFinite(by)) {
      this.setZ(this.z - (+by));
    }
    
    return this.z;
  };
  
  Layer.prototype.moveUp = function (by) {
    if (typeof(by) === 'undefined') {
      by = 1;
    }
    
    if (isFinite(by)) {
      this.setZ(this.z + (+by));
    }
    
    return this.z;
  };

  Layer.prototype.toTop = function () {
    this.setZ(this.screen.getLayerCount() - 1);
    
    return this.z;
  };
  // ...Z-Order
  
  Layer.prototype.update = function () {
    var layer = this;
    
    clear(layer.gfx.sprites);
    
    gamework.collections.foreach(function (sprite) {
      sprite.update(layer.gfx.sprites);
    }, layer.sprites);
  };
  
  
  Layer.prototype.generateSpriteName = function () {
    var name;
    
    do {
      name = '$' + this.nextSpriteId + '$';
      
      this.nextSpriteId += 1;
    } while (this.sprites.hasOwnProperty(name));
    
    return name;
  };
  
  
  Layer.prototype.newSprite = function (name) {
    var sprite, nameCi;
    
    if (!name) {
      name = this.generateSpriteName();
    }
    
    name   = exports.validateId(name);
    nameCi = name.toLowerCase();
    
    if (name !== '') {
      if (!this.sprites.hasOwnProperty(nameCi)) {
        sprite = new exports.Sprite(name, this);
        this.sprites[nameCi] = sprite;
        
        this.currentSprite = sprite;
      } else {
        name = '';
      }
    }
    
    return name;
  };
  
  
  Layer.prototype.removeSprite = function (name) {
    var sprite, removedName = '';
    
    if (typeof(name) === 'undefined') {
      name = this.currentSprite.name;
    }
    
    name = exports.validateId(name).toLowerCase();
    
    if (name !== '') {
      if (gamework.collections.len(this.sprites) > 1) {
        if (this.sprites.hasOwnProperty(name)) {
          sprite = this.sprites[name];
          
          delete this.sprites[name];
          
          if (this.currentSprite === sprite) {
            this.currentSprite = gamework.collections.values(this.sprites)[0];
          }
          
          removedName = sprite.name;
        }
      }
    }
    
    return removedName;
  };
  
  
  Layer.prototype.getCurrentSpriteName = function () {
    return this.currentSprite.name;
  };
  
  Layer.prototype.setCurrentSpriteName = function (name) {
    name = exports.validateId(name).toLowerCase();
    
    if (name !== '') {
      if (this.sprites.hasOwnProperty(name)) {
        this.currentSprite = this.sprites[name];
      }
    }
  };
  
  Layer.prototype.onResize = function () {
    var size = this.screen.getSize();
    
    this.els.paper.setAttribute('width',  size.x);
    this.els.paper.setAttribute('height', size.y);
    
    this.els.tiles.setAttribute('width',  size.x);
    this.els.tiles.setAttribute('height', size.y);
    
    this.els.sprites.setAttribute('width',  size.x);
    this.els.sprites.setAttribute('height', size.y);
    
    identity(this.gfx.paper);
    this.gfx.paper.translate(Math.floor(size.x / 2), Math.floor(size.y / 2));
    this.gfx.paper.scale(1, -1);
    
    this.gfx.sprites.setTransform(1, 0, 0, 1, 0, 0);
    this.gfx.sprites.translate(Math.floor(size.x / 2), Math.floor(size.y / 2));
    this.gfx.sprites.scale(1, -1);
  };
  
  Layer.prototype.getSpritesByName = function () {
    return gamework.collections.keys(this.sprites);
  };
  
  Layer.prototype.clear = function () {
    var g = this.gfx.paper;
    
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.restore();
  };
  
  exports.install = function (ns) {
    ns.Layer = Layer;
  };
  
  exports.install(exports);
}(gamework.internal));
