(function (exports, Sprite) {
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
    
    this.els.container.setAttribute('class', 'micro-layer');
    this.els.paper.setAttribute('class', 'micro-sublayer');
    this.els.tiles.setAttribute('class', 'micro-sublayer');
    this.els.sprites.setAttribute('class', 'micro-sublayer');
    
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
  
  
  Layer.prototype.update = function () {
    var layer = this;
    
    clear(layer.gfx.sprites);
    
    micro.collections.foreach(function (sprite) {
      sprite.update(layer.gfx.sprites);
    }, layer.sprites);
  };
  
  
  Layer.prototype.generateSpriteName = function () {
    var name;
    
    do {
      name = '<' + this.nextSpriteId + '>';
      
      this.nextSpriteId += 1;
    } while (this.sprites.hasOwnProperty(name));
    
    return name;
  };
  
  
  Layer.prototype.newSprite = function (name) {
    var sprite;
    
    if (typeof(name) === 'undefined') {
      name = this.generateSpriteName();
    }
    
    name = name.toString().toLowerCase();
    
    if (!this.sprites.hasOwnProperty(name) && (name.length > 0)) {
      sprite = new Sprite(name, this);
      this.sprites[name] = sprite;
      
      this.currentSprite = sprite;
      
      return name;
    }
    
    return null;
  };
  
  Layer.prototype.getCurrentSpriteName = function () {
    return this.currentSprite.name;
  };
  
  Layer.prototype.setCurrentSpriteName = function (name) {
    if (typeof(name) !== 'undefined') {
      name = name.toString().toLowerCase();
      if (name.length > 0) {
        if (this.sprites.hasOwnProperty(name)) {
          this.currentSprite = this.sprites[name];
        }
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
  
  exports.install = function (ns) {
    ns.Layer = Layer;
  };
  
  exports.install(exports);
}(micro._, micro._.Sprite));
