var micro          = micro || {};
    micro.graphics = micro.graphics || {};
    
(function (exports) {
  var dom             = { parent: null },
      bordercolor     = '#707070',
      backgroundcolor = '#808080',
      imageCache      = {},
      layers          = {},
      currentLayer,
      gfx = {
        loadIdentity: function (g) {
          // Load identity
          g.setTransform(1, 0, 0, 1, 0, 0);
          
          // [0, 0] is in the center of the screen
          g.translate(Math.floor(micro.graphics.screenwidth  / 2),
                      Math.floor(micro.graphics.screenheight / 2));
                        
          // Y-axis points up.
          g.scale(1, -1);
        },
        
        clear: function (g) {
          g.save();
          g.setTransform(1, 0, 0, 1, 0, 0);
          g.clearRect(0, 0, micro.graphics.screenwidth, micro.graphics.screenheight);
          g.restore();
        }
      };
  
  
  function getattr(object, key) {
    var ikey;
    
    for (ikey in object) {
      if (object.hasOwnProperty(ikey)) {
        if (ikey.match(key)) {
          return object[ikey];
        }
      }
    }
  }
  
  
  function vector() {
    var arg0 = arguments[0], width, height;
    
    if (arguments.length === 0) {
      return {x: 0, y: 0};
    } else if (arguments.length === 1) {
      if (arg0 instanceof Array) {
        return {x: +arg0[0], y: +arg0[1]};
      } else if (typeof(arg0) === 'object') {
        width  = getattr(arg0, /^(r?x|r?i|(w(id)?(th)?))$/i);
        height = getattr(arg0, /^(r?y|r?j|(h(eigh)?t?))$/i);
        return {x: +width, y: +height};
      }
    } else {
      return {x: +arguments[0], y: +arguments[1]};
    }
  }
  
  
  function Sprite(name, layer) {
    this.layer       = layer;
    this.name        = name;
    this.pencolor    = 'black';
    this.pensize     = 1;
    this.pendown     = false;
    this.fillcolor   = 'white';
    this.visible     = true;
    
    this.x           = 0;
    this.y           = 0;
    this.a           = 0;
    this.scale       = 1;
    this.scalex      = 1;
    this.scaley      = 1;
    this.image       = null;
    this.frameWidth  = 0;
    this.frameHeight = 0;
  }
  
  Sprite.prototype.drawCircle = function () {
    var pos, g = this.layer.dom.paperCtx, x = this.x, y = this.y, r;
    
    if (arguments.length === 1) {
      r = +arguments[0];
    } else if (arguments.length === 2) {
      pos = vector(arguments[0]);
      x = pos.x;
      y = pos.y;
      r = +arguments[1];
    } else if (arguments.length === 3) {
      x = +arguments[0];
      y = +arguments[1];
      r = +arguments[2];
    } else {
      return;
    }
    
    g.strokeStyle = this.pencolor;
    g.lineWidth   = this.pensize;
    
    g.save();
    
    g.translate(x, y);
    g.rotate(this.a);
    
    g.beginPath();
    
    g.arc(0, 0, r, 0, Math.PI * 2);
    
    g.stroke();
    g.restore();
  };
  
  Sprite.prototype.drawElispe = function () {
  };
  
  Sprite.prototype.drawSquare = function () {
    var pos, g = this.layer.dom.paperCtx, x = this.x, y = this.y, r;
    
    if (arguments.length === 1) {
      r = +arguments[0];
    } else if (arguments.length === 2) {
      pos = vector(arguments[0]);
      x = pos.x;
      y = pos.y;
      r = +arguments[1];
    } else if (arguments.length === 3) {
      x = +arguments[0];
      y = +arguments[1];
      r = +arguments[2];
    } else {
      return;
    }
    
    g.strokeStyle = this.pencolor;
    g.lineWidth   = this.pensize;
    
    g.save();
    
    g.translate(x, y);
    g.rotate(-this.a);
    
    g.beginPath();
    
    g.moveTo(-r / 2,  r / 2);
    g.lineTo( r / 2,  r / 2);
    g.lineTo( r / 2, -r / 2);
    g.lineTo(-r / 2, -r / 2);
    
    g.closePath();
    g.stroke();
    g.restore();
  };
  
  Sprite.prototype.drawRectangle = function () {
  };
  
  
  Sprite.prototype.moveTo = function (x, y) {
    var g;
    
    x = +x;
    y = +y;
    
    if (this.pendown) {
      g = this.layer.dom.paperCtx;
      
      g.strokeStyle = this.pencolor;
      g.lineWidth   = this.pensize;
      
      g.beginPath();
      g.moveTo(this.x, this.y);
      g.lineTo(x, y);
      g.stroke();
    }
    
    this.x = x;
    this.y = y;
  };
  
  Sprite.prototype.moveBy = function (i, j) {
    this.moveTo(this.x + i, this.y + j);
  };
  
  Sprite.prototype.forward = function (m) {
    var i, j;
    
    m = +m;
    
    i = -Math.cos(this.a + (Math.PI / 2)) * m;
    j =  Math.sin(this.a + (Math.PI / 2)) * m;
    
    this.moveBy(i, j);
  };
  
  Sprite.prototype.draw = function (g) {
    if (!this.visible) {
      return;
    }
    
    g.save();
    
    g.translate(this.x, this.y);
    g.scale(this.scalex, this.scaley);
    g.rotate(-this.a);
    
    if (this.image) {
    } else {
      this.drawDefaultSprite(g);
    }
    
    g.restore();
  };
  
  Sprite.prototype.drawDefaultSprite = function (g) {
    // Arrow outline.
    g.strokeStyle = 'white';
    g.lineWidth   = 5;
    g.beginPath();
    g.moveTo( 10.405, -5.978);
    g.lineTo(  0.000, 12.000);
    g.lineTo(-10.405, -5.978);
    g.stroke();
    
    // Arrow fill.
    g.strokeStyle = 'black';
    g.lineWidth   = 3;
    g.beginPath();
    g.moveTo( 10.405, -5.978);
    g.lineTo(  0.000, 12.000);
    g.lineTo(-10.405, -5.978);
    g.stroke();
    
    // Pen outline.
    g.strokeStyle = 'white';
    g.lineWidth   = 1;
    g.beginPath();
    g.arc(0, 0, 3.5, 0, Math.PI * 2);
    g.stroke();
    
    if (this.pendown) {
      g.fillStyle = this.pencolor;
      g.beginPath();
      g.arc(0, 0, 3, 0, Math.PI * 2);
      g.fill();
    } else {
      g.strokeStyle = this.pencolor;
      g.beginPath();
      g.arc(0, 0, 2.5, 0, Math.PI * 2);
      g.stroke();
    }
  };
  
  
  function Layer (name) {
    this.name = name;
    
    this.added = false;
    this.sprites = {'default': new Sprite('default', this)};
    this.currentSprite = this.sprites['default'];
    this.currentSprite.pendown = true;
    this.currentSprite.visible = false;
    
    this.dom = {
      container: document.createElement('div'),
      paper:     document.createElement('canvas'),
      tiles:     document.createElement('canvas'),
      sprites:   document.createElement('canvas')
    };
    
    this.dom.container.setAttribute('class',     'micro-layer');
    this.dom.container.setAttribute('className', 'micro-layer');
    
    this.dom.paper.setAttribute('class',     'micro-sublayer');
    this.dom.paper.setAttribute('className', 'micro-sublayer');
    this.dom.paperCtx = this.dom.paper.getContext('2d');
    
    this.dom.tiles.setAttribute('class',     'micro-sublayer');
    this.dom.tiles.setAttribute('className', 'micro-sublayer');

    this.dom.sprites.setAttribute('class',     'micro-sublayer');
    this.dom.sprites.setAttribute('className', 'micro-sublayer');
    this.dom.spritesCtx = this.dom.sprites.getContext('2d');
    
    this.dom.container.appendChild(this.dom.paper);
    this.dom.container.appendChild(this.dom.tiles);
    this.dom.container.appendChild(this.dom.sprites);
    
    this.resize();
  };
  
  Layer.prototype.addToScreen = function (after) {
    if (this.added) {
      dom.screen.removeChild(this.dom.container);
    }
    
    if (after) {
      // TODO
    } else {
      dom.screen.appendChild(this.dom.container);
    }
  };
  
  Layer.prototype.resize = function () {
    this.dom.paper.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.paper.setAttribute('height', micro.graphics.screenheight);
    gfx.loadIdentity(this.dom.paperCtx);
    
    this.dom.tiles.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.tiles.setAttribute('height', micro.graphics.screenheight);
    
    this.dom.sprites.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.sprites.setAttribute('height', micro.graphics.screenheight);
    gfx.loadIdentity(this.dom.spritesCtx);
  };
  
  Layer.prototype.draw = function () {
    var layer = this;
    
    gfx.clear(layer.dom.spritesCtx);
    micro.collections.foreach(function (sprite) {
      sprite.draw(layer.dom.spritesCtx);
    }, layer.sprites);
  };
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      screenwidth: {
        get: function () {
          return +dom.screen.style.width.substring(0, dom.screen.style.width.length - 2);
        },
        set: function (width) {
          micro.graphics.resizescreen(width, micro.graphics.screenheight);
        }
      },
      
      screenheight: {
        get: function () {
          return +dom.screen.style.height.substring(0, dom.screen.style.height.length - 2);
        },
        set: function (height) {
          micro.graphics.resizescreen(micro.graphics.screenwidth, height);
        }
      },
      
      
      bordercolor: {
        get: function () {
          return bordercolor;
        },
        set: function (color) {
          dom.container.style.backgroundColor = bordercolor = color;
        }
      },
      
      backgroundcolor: {
        get: function () {
          return backgroundcolor;
        },
        set: function (color) {
          dom.screen.style.backgroundColor = backgroundcolor = color;
        }
      },
    
      
      pencolor: {
        get: function () {
          return currentLayer.currentSprite.pencolor;
        },
        set: function (color) {
          currentLayer.currentSprite.pencolor = '' + color;
        }
      },
      
      pensize: {
        get: function () {
          return currentLayer.currentSprite.pensize;
        },
        set: function (size) {
          currentLayer.currentSprite.pensize = +size;
        }
      }
    });
    
    ns.drawcircle = function () {
      var sprite = currentLayer.currentSprite;
      
      sprite.drawCircle.apply(sprite, arguments);
    };
    
    ns.drawsquare = function () {
      var sprite = currentLayer.currentSprite;
      
      sprite.drawSquare.apply(sprite, arguments);
    };
    
    
    ns.vector = vector;
    
    ns.__reparent = function (parent) {
      if (dom.parent) {
        dom.parent.removeChild(dom.container);
      }
      
      dom.parent = parent;
      
      parent.appendChild(dom.container);
    };
    
    
    ns.__loopcallback = function () {
      micro.collections.foreach(function (layer) {
        layer.draw();
      }, layers);
    };
    
    ns.resizescreen = function (width, height) {
      width  = +width;
      height = +height;
      
      if (width < 1) {
        width = micro.graphics.screenwidth;
      }
      if (height < 1) {
        height = micro.graphics.screenheight;
      }
      
      dom.screen.style.width  = width + 'px';
      dom.screen.style.height = height + 'px';
      dom.screen.style.marginLeft = (-width / 2) + 'px';
      dom.screen.style.marginTop  = (-height / 2) + 'px';
      
      micro.collections.foreach(function (layer) {
        layers.resize();
      }, layers);
    };
    
    
    ns.home = function () {
      var sprite = currentLayer.currentSprite;
      
      sprite.a = sprite.x = sprite.y = 0;
    };
    
    ns.clear = function () {
      gfx.clear(currentLayer.dom.paperCtx);
    };
    
    ns.show = function () {
      currentLayer.currentSprite.visible = true;
    };
    
    ns.hide = function () {
      currentLayer.currentSprite.visible = false;
    };
    
    ns.moveto = function (x, y) {
      currentLayer.currentSprite.moveTo(x, y);
    };
    
    ns.moveby = function (i, j) {
      currentLayer.currentSprite.moveBy(i, j);
    };
    
    ns.penup = function () {
      currentLayer.currentSprite.pendown = false;
    };
    
    ns.pendown = function () {
      currentLayer.currentSprite.pendown = true;
    };
    
    ns.right = function (angle) {
      angle = micro.math.torad(+angle);
      
      currentLayer.currentSprite.a += angle;
    };
    
    ns.left = function (angle) {
      angle = micro.math.torad(+angle);
      
      currentLayer.currentSprite.a -= angle;
    };
    
    ns.forward = function (m) {
      currentLayer.currentSprite.forward(m);
    };
      
    ns.back = function (m) {
      currentLayer.currentSprite.forward(-m);
    };
  };
  
  
  function initDom() {
    dom.container = document.createElement('div');
    dom.screen    = document.createElement('div');
    
    dom.container.setAttribute('class',     'micro-screen-container');
    dom.container.setAttribute('className', 'micro-screen-container');
    
    dom.container.style.backgroundColor = bordercolor;
    
    dom.screen.setAttribute('class',     'micro-screen');
    dom.screen.setAttribute('className', 'micro-screen');
    
    dom.screen.style.backgroundColor = backgroundcolor;
    
    micro.graphics.resizescreen(400, 600);
    
    dom.container.appendChild(dom.screen);
    
    currentLayer = new Layer('default');
    layers.default = currentLayer;
    currentLayer.addToScreen();
  }
  
  function init() {
    initDom();
  }
  
  exports.install(exports);
  
  init();
}(micro.graphics));
