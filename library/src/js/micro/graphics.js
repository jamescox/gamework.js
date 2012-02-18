/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */

var micro          = micro || {};
    micro.graphics = micro.graphics || {};
    
(function (exports) {
  'use strict';
  
  var dom             = { parent: null },
      bordercolor     = '#707070',
      backgroundcolor = '#808080',
      frames          = 0,
      layers          = {},
      input           = { mouseX: 0, mouseY: 0, mouseButtons: {} },
      images          = {},
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
  
  
  function getImage(name) {
    name = name.toString();
    
    if (images.hasOwnProperty(name)) {
      return images[name];
    } else {
      micro.app.startloadtask();
      
      var img = new Image();
      img.onload = function () {
        micro.app.endloadtask();
      }
      img.src = 'app' + name;
      
      images[name] = img;
      
      return img;
    }
  }
  
    
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
  
  
  function vector(x, y) {
    if ((typeof(x) === 'undefined') && (typeof(y) === 'undefined')) {
      x = 0;
      y = 0;
    } else if (typeof(y) === 'undefined') {
      if (x instanceof Array) {
        y = +x[1];
        x = +x[0];
      } else if (typeof(x) === 'object') {
        y = +getattr(x, /^(r?y|r?j|(h(eigh)?t?))$/i);
        x = +getattr(x, /^(r?x|r?i|(w(id)?(th)?))$/i);
      } else {
        x = NaN;
        y = NaN;
      }
    }
    
    return {x: x, y: y};
  }
  
  
  function Sprite(name, layer) {
    this.layer       = layer;
    this.name        = name;
    this.pencolor    = 'black';
    this.pensize     = 1;
    this.pendown     = false;
    this.fillcolor   = 'white';
    this.visible     = true;
    this.update      = null;
    this.data        = {};
    
    this.x           = 0;
    this.y           = 0;
    this.a           = 0;
    this.scale       = 1;
    this.scalex      = 1;
    this.scaley      = 1;
    this.image       = 'arrow';
    this.frameWidth  = 0;
    this.frameHeight = 0;
  }
  
  function parsePosSize(sprite, args) {
    var pos, params = {x: sprite.x, y: sprite.y, size: 0};
    
    if (args.length === 1) {
      params.size = +args[0];
    } else if (args.length === 2) {
      pos = vector(args[0]);
      params.x    = pos.x;
      params.y    = pos.y;
      params.size = +args[1];
    } else if (args.length === 3) {
      params.x    = +args[0];
      params.y    = +args[1];
      params.size = +args[2];
    }
    
    return params;
  }
  
  
  Sprite.prototype.transform = function (g, x, y) {
    g.save();
    
    g.translate(x, y);
    g.scale(this.scalex, this.scaley);
    g.rotate(-this.a);
  };
  
  
  Sprite.prototype.drawCircle = function (params) {
    var g = this.layer.dom.paperCtx;
    
    this.transform(g, params.x, params.y);
    
    g.strokeStyle = this.pencolor;
    g.lineWidth   = this.pensize;
    
    g.beginPath();
    g.arc(0, 0, params.size / 2, 0, Math.PI * 2);
    g.stroke();
    
    g.restore();
  };
  
  Sprite.prototype.drawElispe = function () {
  };
  
  Sprite.prototype.drawSquare = function (params) {
    var g = this.layer.dom.paperCtx, w2 = params.size / 2;
    
    this.transform(g, params.x, params.y);
    
    g.strokeStyle = this.pencolor;
    g.lineWidth   = this.pensize;
    
    g.beginPath();
    g.moveTo(-w2,  w2);
    g.lineTo( w2,  w2);
    g.lineTo( w2, -w2);
    g.lineTo(-w2, -w2);
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
    
    this.transform(g, this.x, this.y);
    
    if (this.image === 'arrow') {
      this.drawArrowSprite(g);
    } else if (this.image === 'ghost') {
      this.drawGhostSprite(g);
    } else if (this.image === 'pacman') {
      this.drawPacManSprite(g);
    } else {
      this.drawImageSprite(g);
    }
    
    g.restore();
  };
  
  
  Sprite.prototype.drawImageSprite = function (g) {
    g.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
  };
  
  
  Sprite.prototype.drawArrowSprite = function (g) {
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
  
  
  Sprite.prototype.drawGhostSprite = function (g) {
    g.fillStyle = this.pencolor;
    
    g.beginPath();
    
    g.arc(0, 0, 18, 0, Math.PI);
    
    g.arc(-18, -15, 3, Math.PI * 1.5, Math.PI * 2);

    g.arc(-12, -15, 3, Math.PI, Math.PI * 2, true);
    g.arc( -6, -15, 3, Math.PI, Math.PI * 2);
    
    g.arc(  0, -15, 3, Math.PI, Math.PI * 2, true);
    g.arc(  6, -15, 3, Math.PI, Math.PI * 2);
    
    g.arc( 12, -15, 3, Math.PI, Math.PI * 2, true);
    g.arc( 18, -15, 3, Math.PI, Math.PI * 1.5);
    
    g.fill();

    g.fillStyle = 'white';    
    
    g.beginPath();
    g.arc(-6, 4, 4, 0, Math.PI * 2);
    g.arc( 6, 4, 4, 0, Math.PI * 2);
    g.fill();
    
    g.fillStyle = 'black';    
    
    g.beginPath();
    g.arc(-6, 4, 2, 0, Math.PI * 2);
    g.arc( 6, 4, 2, 0, Math.PI * 2);
    g.fill();
  };
  
  
  Sprite.prototype.drawPacManSprite = function (g) {
    var t = (1.0 + Math.sin((+(new Date()) / 250) * Math.PI)) * 0.125;
    
    g.fillStyle = this.pencolor;
    
    g.beginPath();
    g.arc(0, 0, 18, Math.PI * 0.5 + (Math.PI * t), Math.PI * 0.5 - (Math.PI * t));
    g.lineTo(0, 0);
    g.fill();
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
  }
  
  Layer.prototype.addToScreen = function (after) {
    if (this.added) {
      dom.screen.removeChild(this.dom.container);
    }
    
    if (!after) {
      dom.screen.appendChild(this.dom.container);
    }
  };
  
  Layer.prototype.resize = function () {
    this.dom.paper.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.paper.setAttribute('height', micro.graphics.screenheight);
    
    this.dom.tiles.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.tiles.setAttribute('height', micro.graphics.screenheight);
    
    this.dom.sprites.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.sprites.setAttribute('height', micro.graphics.screenheight);
    
    gfx.loadIdentity(this.dom.paperCtx);
    gfx.loadIdentity(this.dom.spritesCtx);
  };
  
  Layer.prototype.draw = function () {
    var layer = this, oldSpriteName = micro.graphics.sprite;
      
    micro.collections.foreach(function (sprite) {
      if (sprite.update) {
        micro.graphics.sprite = sprite.name;
        sprite.update();
      }
    }, layer.sprites);
    
    micro.graphics.sprite = oldSpriteName;
    
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
    
      
      mousex: {
        get: function () { return input.mouseX; }
      },
      
      mousey: {
        get: function () { return input.mouseY; }
      },
      
      
      pencolor: {
        get: function () {
          return currentLayer.currentSprite.pencolor;
        },
        set: function (color) {
          currentLayer.currentSprite.pencolor = color.toString();
        }
      },
      
      pensize: {
        get: function () {
          return currentLayer.currentSprite.pensize;
        },
        set: function (size) {
          currentLayer.currentSprite.pensize = +size;
        }
      },
      
      layer: {
        get: function () {
          return currentLayer.name;
        },
        set: function (/*name*/) {
        }
      },
      
      sprite: {
        get: function () {
          return currentLayer.currentSprite.name;
        },
        set: function (name) {
          name = name.toString().toLowerCase();
        
          if (currentLayer.sprites.hasOwnProperty(name)) {
            currentLayer.currentSprite = currentLayer.sprites[name];
          }
        }
      },
      
      spriteskin: {
        get: function () {
          return currentLayer.currentSprite.image;
        },
        set: function (skin) {
          skin = skin.toString();
          
          if (skin[0] !== '/') {
            currentLayer.currentSprite.image = skin;
          } else {
            currentLayer.currentSprite.image = getImage(skin);
          }
        }
      },
      
      spritex: {
        get: function () {
          return currentLayer.currentSprite.x;
        },
        set: function (x) {
          currentLayer.currentSprite.x = +x;
        }
      },
      
      spritey: {
        get: function () {
          return currentLayer.currentSprite.y;
        },
        set: function (y) {
          currentLayer.currentSprite.y = +y;
        }
      },
      
      spriteangle: {
        get: function () {
          return micro.math.fromrad(currentLayer.currentSprite.a);
        },
        set: function (angle) {
          angle = micro.math.torad(angle);
          
          currentLayer.currentSprite.a = angle;
        }
      },
      
      spritedata: {
        get: function () {
          return currentLayer.currentSprite.data;
        },
        set: function (data) {
          currentLayer.currentSprite.data = data;
        }
      },
      
      spriteupdate: {
        get: function () {
          return currentLayer.currentSprite.update;
        },
        set: function (callback) {
          if (typeof(callback) !== 'function') {
            callback = null;
          }
          
          currentLayer.currentSprite.update = callback;
        }
      },
      
      frames: {
        get: function () {
          return frames;
        }
      }
    });
    
    
    ns.mousebutton = function (name) {
      return input.mouseButtons[name];
    };
    
    
    ns.drawcircle = function () {
      var sprite = currentLayer.currentSprite;
      
      sprite.drawCircle(parsePosSize(sprite, arguments));
    };
    
    ns.drawsquare = function () {
      var sprite = currentLayer.currentSprite;
      
      sprite.drawSquare(parsePosSize(sprite, arguments));
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
      
      frames += 1;
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
        layer.resize();
      }, layers);
    };
    
    
    ns.newsprite = function (name) {
      name = name.toString().toLowerCase();
      
      if (name.length !== 0) {    
        if (currentLayer.sprites.hasOwnProperty(name)) {
          return; // Can't create a sprite that already exists.
        }
        
        currentLayer.sprites[name] = new Sprite(name, currentLayer);
        currentLayer.currentSprite = currentLayer.sprites[name];
        
        return name;
      }
    };
    
    ns.stamp = function () {
      currentLayer.currentSprite.draw(currentLayer.dom.paperCtx);
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
    
    dom.container.onmousemove = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
 
      input.mouseX = e.clientX - (dom.screen.offsetLeft + Math.floor(dom.screen.offsetWidth / 2));
      input.mouseY = -(e.clientY - (dom.screen.offsetTop + Math.floor(dom.screen.offsetHeight / 2)));
    };
    
    dom.container.onmousedown = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      input.mouseButtons[e.which] = true;
    };
    
    dom.container.onmouseup = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      input.mouseButtons[e.which] = false;
    };
    
    currentLayer = new Layer('default');
    layers['default'] = currentLayer;
    currentLayer.addToScreen();
  }
  
  function init() {
    initDom();
  }
  
  exports.install(exports);
  
  init();
}(micro.graphics));
