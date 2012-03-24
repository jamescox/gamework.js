(function (exports) {
  'use strict';
  
  // Taken from: http://webreflection.blogspot.com/2009/01/ellipse-and-circle-for-canvas-2d.html
  function ellipse(g, x, y, width, height) {
    var hB = (width / 2) * .5522848,
        vB = (height / 2) * .5522848,
        eX = x + width,
        eY = y + height,
        mX = x + width / 2,
        mY = y + height / 2;
        
    g.moveTo(x, mY);
    g.bezierCurveTo(x, mY - vB, mX - hB, y, mX, y);
    g.bezierCurveTo(mX + hB, y, eX, mY - vB, eX, mY);
    g.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
    g.bezierCurveTo(mX - hB, eY, x, mY + vB, x, mY);
    g.closePath();
  }
  
  function Sprite(name, layer) {
    // Ownership properties.
    this.name  = name;
    this.layer = layer;
    
    // Positional properties.
    this.position = gamework.math.vector(0, 0);
    this.angle = 0;
    this.size = gamework.math.vector(40, 40); 
    
    // Drawing properties.
    this.pen = {
      down:     false, 
      color:    gamework.graphics.color(0, 0, 0), 
      cssColor: 'rgb(0,0,0)', 
      size:     1
    };
    this.fill = {
      color:    gamework.graphics.color(1, 1, 1),
      cssColor: 'rgb(255,255,255)'
    };
    
    // Appearance properties.
    this.scale   = {x: 1, y: 1, both: 1};
    this.visible = 1.0;
    this.skin    = 'arrow';
    this.image   = '';
    this.tileset = '';
    this.tilemap = new exports.TileMap();
    
    // Behaviour / Animation.
    this.userUpdateFunction = null;
    
    // this.tileinfo = {width: 0, height: 0};
    // this.tile     = 0; // The default tile.
    
    // IDEA:  this.direction = {x: 0, y: 0, angle: 0};
    
    // Other
    this.data = {};
  }
  
  
  Sprite.prototype.rename = function (name) {
    var nameCi;
    
    name   = exports.validateId(name);
    nameCi = name.toLowerCase();
    
    if ((name !== '') && !this.layer.sprites.hasOwnProperty(nameCi)) {
      delete this.layer.sprites[this.name.toLowerCase()];
      
      this.layer.sprites[nameCi] = this;
      
      this.name = name;
    }
  
    return this.name;
  };
  
  
  // Sprite rendering...
  Sprite.prototype.update = function (g) {
    var previousCurrentSprite = this.layer.currentSprite;
    
    if (this.userUpdateFunction) {
      this.layer.currentSprite = this;
      this.userUpdateFunction();
      this.layer.currentSprite = previousCurrentSprite;
    }
    
    this.draw(g);
    
    // this.drawDebugInfo(g);
  };
  
  
  Sprite.prototype.draw = function (g) {
    if (this.visible > 0.0) {
      g.save();
      
      g.translate(this.position.x, this.position.y);
      g.scale(this.scale.x, this.scale.y);
      g.rotate(-this.angle);
      
      g.globalAlpha = this.visible;
      
      switch (this.skin) {
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
        
      case 'image':
        this.drawImageSprite(g);
        break;
        
      case 'tilemap':
        this.drawTileMapSprite(g);
        break;
      }
      
      g.restore();
    }
  };
  
  
  Sprite.prototype.drawDebugInfo = function (g) {
    var w = this.size.x * this.scale.x, 
        h = this.size.y * this.scale.y,
        a = this.visible ? 1 : 0.333,
        f = gamework.graphics.color(this.fill.color.r, this.fill.color.g, this.fill.color.b, this.fill.color.a * a),
        s = gamework.graphics.color(this.pen.color.r, this.pen.color.g, this.pen.color.b, this.pen.color.a * a),
        r = this.pen.size * 2;
    
    if (this.layer.currentSprite === this) {
      g.strokeStyle = 'rgba(255, 0, 0, ' + a + ')';
    } else {
      g.strokeStyle = 'rgba(0, 0, 255, ' + a + ')';
    }
    
    g.save();
    
    g.translate(this.position.x, this.position.y);
    g.beginPath();
    g.moveTo(-5,  0);
    g.lineTo( 5,  0);
    g.moveTo( 0, -5);
    g.lineTo( 0,  5);
    g.stroke();
    
    g.save();
    g.rotate(-this.angle);
    
    g.lineWidth   = 1;
    g.strokeRect(-w / 2, -h / 2, w, h);
    g.restore();
    
    g.fillStyle = g.strokeStyle;
    
    g.scale(1, -1);
    g.textBaseline = 'middle';
    g.font = '12px sans-serif'
    g.fillText(this.name, w / 2 + 3, 0);
    
    g.translate(-w / 2 - 3 - r * 1.5, 0);
    g.fillStyle = f.tocss();
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
    
    g.strokeStyle = s.tocss();
    g.lineWidth = this.pen.size;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
    
    if (this.pen.down) {
      g.rotate(Math.PI);
    }
    
    g.fillStyle = 'black'; //'rgba(0, 0, 0, ' + a + ')';
    g.beginPath();
    g.moveTo( 0, -r * 1.5 - 8);
    g.lineTo( 3, -r * 1.5 - 4);
    g.lineTo(-3, -r * 1.5 - 4);
    g.fill();
    
    g.restore();
  };
  
  
  Sprite.prototype.drawArrowSprite = function (g) {
    var sz = Math.min(this.size.x, this.size.y);
    
    g.scale(sz / 36, sz / 36);
    
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
    
    if (this.pen.down) {
      g.fillStyle = this.pen.cssColor;
      g.beginPath();
      g.arc(0, 0, 3, 0, Math.PI * 2);
      g.fill();
    } else {
      g.strokeStyle = this.pen.cssColor;
      g.beginPath();
      g.arc(0, 0, 2.5, 0, Math.PI * 2);
      g.stroke();
    }
  };
  
  Sprite.prototype.drawImageSprite = function (g) {
    var img;
    
    if (this.image) {
      img = exports.getImage(this.image);
      
      if (img.ready) {
        g.save();
    
        g.scale(1, -1);
        g.drawImage(img, -this.size.x / 2, -this.size.y / 2);
        
        g.restore();
      }
    }
  };
  
  Sprite.prototype.drawRectangleSprite = function (g) {
    var w = this.size.x, 
        h = this.size.y;
        
    g.fillStyle = this.fill.cssColor;
    g.fillRect(-w / 2, -h / 2, w, h);
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.strokeRect(-w / 2, -h / 2, w, h);
  };
  
  Sprite.prototype.drawSquareSprite = function (g) {
    var sz = Math.min(this.size.x, this.size.y);
    
    g.fillStyle = this.fill.cssColor;
    g.fillRect(-sz / 2, -sz / 2, sz, sz);
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.strokeRect(-sz / 2, -sz / 2, sz, sz);
  };
  
  Sprite.prototype.drawEllipseSprite = function (g) {
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    ellipse(g, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    g.fill();
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.beginPath();
    ellipse(g, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    g.stroke();
  };
  
  Sprite.prototype.drawCircleSprite = function (g) {
    var r = Math.min(this.size.x, this.size.y) / 2;
    
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fill();
    
    g.strokeStyle = this.pen.cssColor;
    g.lineWidth   = this.pen.size;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
  };
  
  Sprite.prototype.drawPacManSprite = function (g) {
    var r = Math.min(this.size.x, this.size.y) / 2, 
        a = 0.125 * Math.max(0, 1 + Math.sin((+(new Date()) / 250) * Math.PI));
    
    g.scale(1, -1);
    g.rotate(-Math.PI / 2);
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    g.moveTo(0, 0);
    g.arc(0, 0, r, Math.PI * a, Math.PI * (2 - a));
    g.lineTo(0, 0);
    g.fill();
  };
  
  Sprite.prototype.drawGhostSprite = function (g) {
    var r    = Math.min(this.size.x, this.size.y) / 2,
        r2   = r / 8,
        eyeR = r / (this.tile === 'scared' ? 5 : 3.5);
    
    // Body
    g.scale(1, -1);
    g.rotate(-this.angle);
    g.fillStyle = this.fill.cssColor;
    g.beginPath();
    g.arc(0, 0, r, Math.PI, Math.PI * 2);
    
    g.arc((r / 3) * 2, (r / 3) * 2, r / 3, 0, Math.PI);
    g.arc(0, (r / 3) * 2, r / 3, 0, Math.PI);
    g.arc(-(r / 3) * 2, (r / 3) * 2, r / 3, 0, Math.PI);
    g.fill();
    
    // Eyes
    g.save();
    g.fillStyle = 'white';
    g.translate(0, -r / 6);
    g.rotate(this.angle);
    g.translate(0, -r / (this.tile === 'scared' ? 20 : 6));
    g.rotate(-this.angle);
    g.translate(-r / 3, 0);
    g.beginPath();
    g.arc(0, 0, eyeR, 0, Math.PI * 2);
    g.arc((r / 3) * 2, 0, eyeR, 0, Math.PI * 2);
    g.fill();
    g.restore();
    
    if (this.tile !== 'scared') {
      // Pupils
      g.fillStyle = this.pen.cssColor;
      g.translate(0, -r / 6);
      g.rotate(this.angle);
      g.translate(0, -r / 3.5);
      g.rotate(-this.angle);
      g.translate(-r / 3, 0);
      g.beginPath();
      g.arc(0, 0, r / 9, 0, Math.PI * 2);
      g.arc((r / 3) * 2, 0, r / 9, 0, Math.PI * 2);
      g.fill();
    } else {
      // Mouth
      g.lineWidth = r / 10;
      g.strokeStyle = 'white';
      g.translate(0, r / 3);
      g.beginPath();
      g.moveTo(-r2 * 4, r2);
      g.lineTo(-r2 * 3, 0);
      g.lineTo(-r2 * 2, r2);
      g.lineTo(-r2 * 1, 0);
      g.lineTo(0, r2);
      g.lineTo(r2 * 1, 0);
      g.lineTo(r2 * 2, r2);
      g.lineTo(r2 * 3, 0);
      g.lineTo(r2 * 4, r2);
      g.stroke();
    }
  };
  
  
  Sprite.prototype.drawTileMapSprite = function (g) {
    this.tilemap.draw(g, this.tileset, this.size.x, this.size.y);
    
    /*
    var tileset = exports.getTileSet(this.tileset);
    
    if (tileset !== null) {
      if (typeof(this.tile) === 'string') {
        tileset.drawAnimatedTile(g, this.tile, 0, this.size.x, this.size.y);
      } else {
        tileset.drawIndexedTile(g, this.tile, this.size.x, this.size.y);
      }
    }*/
  };
  // ...Sprite rendering
  
  
  // Position...
  Sprite.prototype.getPosition = function () {
    return this.position;
  };
  
  // setPosition(x, y)
  // setPosition(vector(x, y))
  Sprite.prototype.setPosition = function (arg1, arg2) {
    var pos = gamework.math.vector(arg1, arg2);
    
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
    var oldPos = this.position;
    
    x = +x;
    
    if (!isNaN(x) && isFinite(x)) {
      this.position = gamework.math.vector(x, oldPos.y);
    }
  };
  
  Sprite.prototype.setY = function (y) {
    var oldPos = this.position;
    
    y = +y;
    
    if (!isNaN(y) && isFinite(y)) {
      this.position = gamework.math.vector(oldPos.x, y);
    }
  };
  
  // moveTo(x, y)
  // moveTo(vector(x, y))
  Sprite.prototype.moveTo = function (arg1, arg2) {
    var pos = gamework.math.vector(arg1, arg2);
    
    if (pos !== null) {
      this.position = pos;
    }
  };
  
  Sprite.prototype.lineTo = function (arg1, arg2) {
    var pos = gamework.math.vector(arg1, arg2), 
        g   = this.layer.gfx.paper;
    
    if (pos !== null) {
      g.strokeStyle = this.pen.cssColor;
      g.lineWidth   = this.pen.size;
    
      g.beginPath();
        g.moveTo(this.position.x, this.position.y);
        g.lineTo(          pos.x,           pos.y);   
      g.stroke();
      
      this.position = pos;
    }
  };
  
  // penTo(x, y)
  // penTo(vector(x, y))
  Sprite.prototype.penTo = function (arg1, arg2) {
    var pos = gamework.math.vector(arg1, arg2);
    
    if (pos !== null) {
      if (this.pen.down) {
        this.lineTo(pos);
      } else {
        this.moveTo(pos);
      }
    }
  };
  
  // penBy(x, y)
  // penBy(vector(x, y))
  Sprite.prototype.penBy = function (arg1, arg2) {
    var pos = gamework.math.vector(arg1, arg2);
    
    if (pos !== null) {
      this.penTo(this.position.x + pos.x, this.position.y + pos.y);
    }
  };
  
  Sprite.prototype.forward = function (m) {
    m = +m;
    
    if (!isNaN(m) && isFinite(m)) {
      this.penBy(Math.sin(this.angle) * m, Math.cos(this.angle) * m);
    }
  };
  
  Sprite.prototype.back = function (m) {
    this.forward(-m);
  };
  
  
  Sprite.prototype.formation = function (leaderName, arg1, arg2) {
    var leader, relPos = gamework.math.vector(arg1, arg2), a;

    leaderName = exports.validateId(leaderName).toLowerCase();
    
    if (relPos !== null) {
      if ((leaderName !== '') && this.layer.sprites.hasOwnProperty(leaderName)) {
        leader = this.layer.sprites[leaderName];
        
        a = Math.atan2(-relPos.y, relPos.x);
        
        this.angle = leader.angle;
        
        this.penTo(
          leader.position.x + Math.cos(a + this.angle) * relPos.m, 
          leader.position.y - Math.sin(a + this.angle) * relPos.m);
      }
    }
  };
  // ...Position
  
  
  // Angle...
  Sprite.prototype.getAngle = function () {
    return gamework.math.fromrad(this.angle);
  };
  
  Sprite.prototype.setAngle = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle = gamework.math.torad(angle);
    }
  };
  
  // turnTo(targetAngle, maxDelta)
  // turnTo(targetAngle)
  Sprite.prototype.turnTo = function (targetAngle, maxDelta) {
    var delta;
    
    targetAngle = gamework.math.torad(+targetAngle);
    
    if (typeof(maxDelta) !== 'undefined') {
      maxDelta = gamework.math.torad(Math.abs(+maxDelta));
    } else {
      maxDelta = Infinity;
    }
    
    if (!(isNaN(targetAngle) || isNaN(maxDelta))) {
      if (isFinite(maxDelta)) {
        delta = targetAngle - this.angle;
        if (delta < -Math.PI) {
          delta = delta + Math.PI * 2;
        } else if (delta > Math.PI) {
          delta = delta - Math.PI * 2;
        }
        
        if (delta >= 0) {
          this.angle += Math.min(Math.abs(delta), maxDelta);
        } else {
          this.angle -= Math.min(Math.abs(delta), maxDelta);
        }
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
    var target, targetX, targetY, targetAngle, maxDelta = Infinity;
    
    if (typeof(arg1) !== 'undefined') {
      if (typeof(arg2) !== 'undefined') {
        if (typeof(arg3) !== 'undefined') {
          // number, number, number
          targetX  = +arg1;
          targetY  = +arg2;
          maxDelta = +arg3;
        } else {
          if (!(isNaN(arg1) || isNaN(arg2))) {
            // number, number
            targetX  = +arg1;
            targetY  = +arg2;
          } else {
            // vector, number
            target   = gamework.math.vector(arg1);
            
            targetX  = target.x;
            targetY  = target.y;
            maxDelta = +arg2;
          }
        }
      } else {
        // vector
        target   = gamework.math.vector(arg1);
        targetX  = target.x;
        targetY  = target.y;
      }
    }
    
    if (!(isNaN(targetX) || isNaN(targetY) || isNaN(maxDelta))) {
      targetAngle = gamework.math.arctan2(
          targetX - this.position.x, targetY - this.position.y);
          
      this.turnTo(targetAngle, maxDelta);
    }
  };
  
  // lookAway(x, y, maxDelta)
  // lookAway(x, y)
  // lookAway(vector(x, y), maxDelta)
  // lookAway(vector(x, y))
  Sprite.prototype.lookAway = function (arg1, arg2, arg3) {
    var target, targetX, targetY, targetAngle, maxDelta = Infinity;
    
    if (typeof(arg1) !== 'undefined') {
      if (typeof(arg2) !== 'undefined') {
        if (typeof(arg3) !== 'undefined') {
          // number, number, number
          targetX  = +arg1;
          targetY  = +arg2;
          maxDelta = +arg3;
        } else {
          if (!(isNaN(arg1) || isNaN(arg2))) {
            // number, number
            targetX  = +arg1;
            targetY  = +arg2;
          } else {
            // vector, number
            target   = gamework.math.vector(arg1);
            
            targetX  = target.x;
            targetY  = target.y;
            maxDelta = +arg2;
          }
        }
      } else {
        // vector
        target   = gamework.math.vector(arg1);
        targetX  = target.x;
        targetY  = target.y;
      }
    }
    
    if (!(isNaN(targetX) || isNaN(targetY) || isNaN(maxDelta))) {
      targetAngle = gamework.math.arctan2(
          this.position.x - targetX, this.position.y - targetY);
          
      this.turnTo(targetAngle, maxDelta);
    }
  };
  
  Sprite.prototype.rotate = function (angle) {
    angle = +angle;
    if (!isNaN(angle)) {
      this.angle += gamework.math.torad(angle);
    }
  };
  
  Sprite.prototype.rotatecc = function (angle) {
    this.rotate(-angle);
  };
  
  Sprite.prototype.right = Sprite.prototype.rotate;
  Sprite.prototype.left  = Sprite.prototype.rotatecc;
  // ...Angle
  
  // Size...
  Sprite.prototype.getSize = function () {
    return this.size;
  };
  
  // setSize(x, y)
  // setSize(vector(x, y))
  Sprite.prototype.setSize = function (arg1, arg2) {
    var size = vector(arg1, arg2);
    
    if (size !== null) {
      this.size = size;
    }
  };
  
  Sprite.prototype.getWidth = function () {
    return this.size.x;
  };
  
  Sprite.prototype.setWidth = function (width) {
    width = +width;
    
    if (!isNaN(width)) {
      this.size = vector(width, this.size.y);
    }
  };
  
  Sprite.prototype.getHeight = function () {
    return this.size.y;
  };
  
  Sprite.prototype.setHeight = function (height) {
    height = +height;
    
    if (!isNaN(height)) {
      this.size = vector(this.size.x, height);
    }
  };
  // ...Size
  
  // Skin...
  Sprite.prototype.getSkin = function () {
    return this.skin;
  };
  
  Sprite.prototype.setSkin = function (skin) {
    skin = skin.toString().toLowerCase();
    
    if (gamework.collections.contains([
      'arrow', 
      'circle', 
      'ellipse', 
      'square', 
      'rectangle', 
      'pacman',
      'ghost',
      'image',
      'tilemap'], skin)) {
      this.skin = skin;
    }
  };
  
  Sprite.prototype.getImage = function () {
    return this.image;
  };
  
  Sprite.prototype.setImage = function (image) {
    image = image + '';
    
    if (image) {
      this.image = image;
    }
  };
  
  
  Sprite.prototype.tile = function (arg1, arg2, arg3) {
    return this.tilemap.tile(arg1, arg2, arg3);
  };
  
  
  /*
  Sprite.prototype.getTile = function () {
    return this.tile;
  };
  
  Sprite.prototype.setTile = function (tile) {
    if (typeof(tile) !== 'number') {
      tile = tile + '';
    }
    
    this.tile = tile;
  };*/
  
  Sprite.prototype.getTileSet = function () {
    return this.tileset;
  };
  
  Sprite.prototype.setTileSet = function (tileset) {
    tileset = exports.validateId(tileset);
    
    if (tileset !== '') {
      this.tileset = tileset;
    }
  };
  // ...Skin
  
  
  // User Update Function...
  Sprite.prototype.getUserUpdateFunction = function () {
    return this.userUpdateFunction;
  }
  
  Sprite.prototype.setUserUpdateFunction = function (fn) {
    if (fn === null) {
      this.userUpdateFunction = null;
    } else if (typeof(fn) === 'function') {
      this.userUpdateFunction = fn;
    }
  };
  // ...User Update Function
  
  
  // Color...
  Sprite.prototype.getPenColor = function () {
    return this.pen.color;
  };
  
  // setPenColor(r, g, b, a)
  // setPenColor(color(...))
  Sprite.prototype.setPenColor = function (arg1, arg2, arg3, arg4) {
    var c = gamework.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.pen.color    = c;
      this.pen.cssColor = c.tocss();
    }
  };
  
  Sprite.prototype.getFillColor = function () {
    return this.pen.color;
  };
  
  // setFillColor(r, g, b, a)
  // setFillColor(color(...))
  Sprite.prototype.setFillColor = function (arg1, arg2, arg3, arg4) {
    var c = gamework.graphics.color(arg1, arg2, arg3, arg4);
    
    if (c !== null) {
      this.fill.color    = c;
      this.fill.cssColor = c.tocss();
    }
  };
  // ...Color
  
  // Pen Size...
  Sprite.prototype.getPenSize = function () {
    return this.pen.size;
  };
  
  Sprite.prototype.setPenSize = function (size) {
    size = +size;
    
    if (!isNaN(size) && isFinite(size)) {
      this.pen.size = size;
    }
  };
  // ...Pen Size
  
  // Pen up/down...
  Sprite.prototype.isPenDown = function () {
    return this.pen.down;
  };
  
  Sprite.prototype.setPenDown = function (down) {
    this.pen.down = !!down;
  };
  
  Sprite.prototype.penDown = function () {
    this.pen.down = true;
  };
  
  Sprite.prototype.penUp = function () {
    this.pen.down = false;
  };
  
  Sprite.prototype.togglePen = function () {
    this.pen.down = !this.pen.down;
  };
  // ...Pen up/down  
  
  // Visibility...
  Sprite.prototype.isVisible = function () {
    return !!this.visible;
  };
  
  Sprite.prototype.setVisible = function (visible) {
    this.visible = !!visible ? 1.0 : 0.0;
  };
  
  Sprite.prototype.getOpacity = function () {
    return this.visible;
  };
  
  Sprite.prototype.setOpacity = function (opacity) {
    this.visible = gamework.math.bound(0, opacity, 1);
  };
  
  Sprite.prototype.show = function () { 
    this.visible = 1.0; 
  };
  
  Sprite.prototype.hide = function () { 
    this.visible = 0.0; 
  };
  // ...Visibility
  
  
  Sprite.prototype.otherSpritesName = function (multiLayer) {
    multiLayer = !!multiLayer;
  };
  
  
  Sprite.prototype.closestSpriteName = function (multiLayer) {
    multiLayer = !!multiLayer;
  };
  
  
  Sprite.prototype.getData = function () {
    return this.data;
  };
  
  Sprite.prototype.setData = function (data) {
    this.data = data;
  };
  
  
  // Drawing...
  
  // TODO
  
  Sprite.prototype.stamp = function () {
    var g          = this.layer.gfx.paper,
        oldOpacity = g.globalAlpha;
    
    g.save();
    
    this.draw(g);
    
    g.restore();
    g.globalAlpha = oldOpacity;
  };
  
  // ...Drawing
  
  exports.install = function (ns) {
    ns.Sprite = Sprite;
  };
  
  exports.install(exports);
}(gamework.internal));
