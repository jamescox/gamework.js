var micro            = micro || {};
    micro.__graphics = micro.__graphics || {};

(function (exports) {
  'use strict';
  
  function Sprite(name, layer) {
    // Ownership properties.
    this.name  = name;
    this.layer = layer;
    
    // Positional properties.
    this.position = {x: 0, y: 0};
    this.angle = 0;
    this.size = {
      // Values less than zero mean use the default size for the 
      // given sprite images, or arbitaraly 36px when no other sane
      // default exists.
      user:     {width: -1, height: -1}, // The value set by the user.  
      internal: {x: 36,     y: 36}       // The actual value.
    }; 
    
    // Drawing properties.
    this.pen = {
      down:     false, 
      color:    micro.graphics.color(0, 0, 0), 
      cssColor: 'rgb(0,0,0)', 
      size:     1
    };
    this.fill = {
      color:    micro.graphics.color(1, 1, 1),
      cssColor: 'rgb(255,255,255)'
    };
    
    // Appearance properties.
    this.scale   = {x: 1, y: 1, both: 1};
    this.visible = true;
    this.image   = 'arrow';
    
    // Behaviour / Animation.
    this.update   = null;
    this.tileinfo = {width: 0, height: 0};
    this.tile     = 0; // The default tile.
    
    // IDEA:  this.direction = {x: 0, y: 0, angle: 0};
    
    // Other
    this.data = {};
  }
  
  // Sprite rendering...
  Sprite.prototype.draw = function (g) {
    g.save();
    
    g.translate(this.position.x, this.position.y);
    g.scale(this.scale.x, this.scale.y);
    g.rotate(-this.angle);
    
    switch (this.image) {
    case 'arrow':
      this.drawArrowSprite(g);
      break;
    
    case 'rectangle':
      this.drawRectangleSprite(g);
      break;
    
    case 'square':
      this.drawSquareSprite(g);
      break;
    
    case 'ellipse':
      this.drawEllipseSprite(g);
      break;
    
    case 'circle':
      this.drawCircleSprite(g);
      break;
    
    case 'pacman':
      this.drawPacManSprite(g);
      break;
      

    case 'ghost':
      this.drawGhostSprite(g);
      break;
      
    default: // An image sprite.
      this.drawImageSprite(g);
      break;
    }
    
    g.restore();
  };
  
  Sprite.prototype.drawArrowSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawImageSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawRectangleSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawSquareSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawEllipseSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawCircleSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawPacManSprite = function (g) {
    // TODO
  };
  
  Sprite.prototype.drawGhostSprite = function (g) {
    // TODO
  };
  // ...Sprite rendering
  
  
  // Position...
  Sprite.prototype.getPosition = function () {
    return this.position;
  };
  
  // setPosition(x, y)
  // setPosition(vector(x, y))
  Sprite.prototype.setPosition = function (arg1, arg2) {
    var pos = micro.graphics.vector(arg1, arg2);
    
    if (pos !== null) {
      this.position = pos;
    }
  };
  
  Sprite.prototype.getX = function () {
    return this.position.x;
  };
  
  Sprite.prototype.getY = function () {
    return this.position.y;
  };
  
  Sprite.prototype.setX = function (x) {
    x = +x;
    if (!isNaN(x) && isFinite(x)) {
      this.position.x = x;
    }
  };
  
  Sprite.prototype.setY = function (y) {
    y = +y;
    if (!isNaN(y) && isFinite(y)) {
      this.position.y = y;
    }
  };
  
  // moveTo(x, y)
  // moveTo(vector(x, y))
  Sprite.prototype.moveTo = function (arg1, arg2) {
    var pos = micro.math.vector(arg1, arg2), g = this.layer.paperCtx;
    
    if (pos !== null) {
      if (this.pen.down) {
        g.strokeStyle = pen.cssColor;
        g.lineWidth   = pen.size;
      
        g.beginPath();
          moveTo(this.position.x, this.position.y);
          lineTo(          pos.x,           pos.y);   
        g.stroke();
      }
      
      this.position = pos;
    }
  };
  
  // moveBy(x, y)
  // moveBy(vector(x, y))
  Sprite.prototype.moveBy = function (arg1, arg2) {
    var pos = micro.math.vector(arg1, arg2);
    
    if (pos !== null) {
      this.moveTo(this.position.x + pos.x, this.position.y + pos.y);
    }
  };
  
  Sprite.prototype.forward = function (m) {
    m = +m;
    
    if (!isNaN(m) && isFinite(m)) {
      this.moveBy(Math.cos(this.angle) * m, Math.sin(this.angle) * m);
    }
  };
  
  Sprite.prototype.back = function (m) {
    this.forward(-m);
  };
  // ...Position
  
  
  // Angle...
  Sprite.prototype.getAngle = function () {
    return micro.math.fromrad(this.angle);
  };
  
  Sprite.prototype.setAngle = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle = micro.math.torad(angle);
    }
  };
  
  // turnTo(targetAngle, maxDelta)
  // turnTo(targetAngle)
  Sprite.prototype.turnTo = function (targetAngle, maxDelta) {
    targetAngle = micro.math.torad(+targetAngle);
    
    if (typeof(maxDelta) !== 'undefined') {
      maxDelta = micro.math.torad(Math.abs(+maxDelta));
    } else {
      maxDelta = Infinity;
    }
    
    if (!(isNaN(targetAngle) || isNaN(maxDelta))) {
      if (isFinite(maxDelta)) {
        // TODO
      } else {
        this.angle = targetAngle;
      }
    }
  };
  
  // lookAt(x, y, maxDelta)
  // lookAt(x, y)
  // lookAt(vector(x, y), maxDelta)
  // lookAt(vector(x, y))
  Sprite.prototype.lookAt = function (arg1, arg2, arg3) {
    var targetX, targetY, targetAngle, maxDelta;
    
    // TODO
    
    if (!(isNaN(targetX) || isNaN(targetY) || isNaN(maxDelta))) {
      this.turnTo(targetAngle, maxDelta);
    }
  };
  
  Sprite.prototype.rotate = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle += micro.math.torad(angle);
    }
  };
  
  Sprite.prototype.rotatecc = function (angle) {
    this.rotate(-angle);
  };
  
  Sprite.prototype.right = Sprite.prototype.rotate;
  Sprite.prototype.left  = Sprite.prototype.rotatecc;
  // ...Angle
  
  
  // Color...
  // setPenColor(r, g, b, a)
  // setPenColor(color(...))
  Sprite.prototype.setPenColor = function (arg1, arg2, arg3, arg4) {
  };
  // ...Color
  
  
  // Visibility...
  Sprite.prototype.isVisible = function () {
    return this.visible;
  };
  
  Sprite.prototype.setVisible = function (visible) {
    this.visible = !!visible;
  };
  
  Sprite.prototype.show = function () { 
    this.visible = true; 
  };
  
  Sprite.prototype.hide = function () { 
    this.visible = false; 
  };
  // ...Visibility
    
  
  exports.install = function (ns) {
    ns.Sprite = Sprite;
  };
  
  exports.install(exports);
}(micro.__graphics));
