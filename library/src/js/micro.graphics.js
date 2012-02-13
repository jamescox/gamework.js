var micro          = micro || {};
    micro.graphics = micro.graphics || {};
    
(function (exports) {
  var dom             = { parent: null },
      bordercolor     = '#707070',
      backgroundcolor = '#808080',
      imageCache      = {},
      currentLayer;
  
  
  function Sprite (name) {
    this.name = 'default';
  }
  
      
  function Layer (name) {
    this.name = name;
    
    this.added = false;
    
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

    this.dom.tiles.setAttribute('class',     'micro-sublayer');
    this.dom.tiles.setAttribute('className', 'micro-sublayer');

    this.dom.sprites.setAttribute('class',     'micro-sublayer');
    this.dom.sprites.setAttribute('className', 'micro-sublayer');
    
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
    
    this.dom.tiles.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.tiles.setAttribute('height', micro.graphics.screenheight);
    
    this.dom.sprites.setAttribute('width',  micro.graphics.screenwidth);
    this.dom.sprites.setAttribute('height', micro.graphics.screenheight);
  };
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      __reparent: {
        value: function (parent) {
          if (dom.parent) {
            dom.parent.removeChild(dom.container);
          }
          
          dom.parent = parent;
          
          parent.appendChild(dom.container);
        }
      },
      
      resizescreen: {
        value: function (width, height) {
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
        }
      },
      
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
      }
    });
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
    currentLayer.addToScreen();
  }
  
  function init() {
    initDom();
  }
  
  exports.install(exports);
  
  init();
}(micro.graphics));