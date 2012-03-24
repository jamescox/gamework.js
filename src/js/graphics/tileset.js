(function (exports, internal) {
  'use strict';
  
  var oldInstall = exports.install, tilesets = {};
  
  
  function Sequence(name, frames, frameratio, loops, loopmode) {
  }
  
  
  function TileSet(name, imagename, tilewidth, tileheight, left, top, right, bottom) {
    this.name       = name;
    
    this.imagename  = imagename
    this.image      = internal.getImage(imagename);
    
    this.tilewidth  = tilewidth;
    this.tileheight = tileheight;
    this.left       = left;
    this.top        = top;
    this.right      = right;
    this.bottom     = bottom;
    
    this.widthInTiles  = -1;
    this.heightInTiles = -1;
    this.tiles         = -1;
    
    this.animations = {};
  }
  
  
  TileSet.prototype.drawIndexedTile = function (g, index, width, height) {
    if (isFinite(index)) {
      index = Math.floor(+index);
      
      if (this.image.ready) {
        if (this.tiles === -1) {
          if (this.right === -1) {
            this.right = this.image.width;
          }
          if (this.bottom === -1) {
            this.bottom = this.image.height;
          }
          this.widthInTiles  = Math.floor(
            (this.right - this.left) / this.tilewidth);
          this.heightInTiles = Math.floor(
            (this.bottom - this.top) / this.tileheight);
          this.tiles = (this.widthInTiles * this.heightInTiles);
        }
        
        index = gamework.math.wrapint(index, this.tiles + 1);
        
        if (index > 0) {
          index -= 1;
          
          g.save();
          g.scale(1, -1);
          
          g.drawImage(
            this.image, 
            this.left + (index % this.widthInTiles) * this.tilewidth,
            this.top + Math.floor(index / this.widthInTiles) * this.tileheight,
            this.tilewidth, this.tileheight,
            -width / 2, -height / 2, width, height);
          
          g.restore();
        }
      }
    }
  };
  
  
  TileSet.prototype.drawAnimatedTile = function (g, name, baseFrame, width, height) {
    var animation, frameIndex;
    
    name = internal.validateId(name).toLowerCase();
    
    if (name !== '') {
      animation = this.animations[name];
      if (animation) {
        switch (animation.loop) {
        case 'cycle':
          frameIndex = Math.floor((gamework.graphics.framecount - baseFrame) / animation.rate) % animation.frames.length;
          break;
        };
        
        this.drawIndexedTile(g, animation.frames[frameIndex], width, height);
      }
    }
  };
  
  
  function newtileset(name, image, arg1, arg2, arg3, arg4, arg5, arg6) {
    var tileSet, nameCi, tileSize=null, 
        p1=gamework.math.vector(0, 0), 
        p2=gamework.math.vector(-1, -1);
        
    name   = internal.validateId(name);
    nameCi = name.toLowerCase();
    
    if (typeof(arg6) !== 'undefined') {
      // 6 argument call, should be all numbers.
      tileSize = gamework.math.vector(+arg1, +arg2);
      p1       = gamework.math.vector(+arg3, +arg4);
      p2       = gamework.math.vector(+arg5, +arg6);
    } else if (typeof(arg5) !== 'undefined') {
      // 5 argument call, should be one vector and rest numbers
      if (isNaN(arg1)) { // tileSize is a vector like?
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(+arg2, +arg3);
        p2       = gamework.math.vector(+arg4, +arg5);
      } else if (isNaN(arg3)) { // p1 is vector like.
        tileSize = gamework.math.vector(+arg1, +arg2);
        p1       = gamework.math.vector(arg3);
        p2       = gamework.math.vector(+arg4, +arg5);
      } else if (isNaN(arg5)) { // p2 is vector like.
        tileSize = gamework.math.vector(+arg1, +arg2);
        p1       = gamework.math.vector(+arg3, +arg4);
        p2       = gamework.math.vector(arg5);
      }
    } else if (typeof(arg4) !== 'undefined') {
      if (!(isNaN(arg1) || isNaN(arg2) || isNaN(arg3) || isNaN(arg4))) {
        // 4 arguments all numbers, p2 is default value.
        tileSize = gamework.math.vector(+arg1, +arg2);
        p1       = gamework.math.vector(+arg3, +arg4);
      } else /* 4 arguments, 2 vectors and 2 numbers */ if (!isNaN(arg1)) { // tileSize is 2 numbers
        tileSize = gamework.math.vector(+arg1, +arg2);
        p1       = gamework.math.vector(arg3);
        p2       = gamework.math.vector(arg4);
      } else if (!isNaN(arg2)) { // p1 is 2 numbers
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(+arg2, +arg3);
        p2       = gamework.math.vector(arg4);
      } else if (!isNaN(arg3)) { // p2 is 2 numbers
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(arg2);
        p2       = gamework.math.vector(+arg3, +arg4);
      }
    } else if (typeof(arg3) !== 'undefined') {
      // 3 arguments
      if (isNaN(arg1) && isNaN(arg2) && isNaN(arg3)) { // all 3 arguments are vectors.
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(arg2);
        p2       = gamework.math.vector(arg3);
      } else /* 3 arguments, 1 vector, 2 numbers, p2 is defualt value.  */ if (isNaN(arg1)) { // tileSize is a vector
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(+arg2, +arg3);
      } else if (isNaN(arg3)) { // p1 is a vector
        tileSize = gamework.math.vector(+arg1, +arg2);
        p1       = gamework.math.vector(arg3);
      }
    } else if (typeof(arg2) !== 'undefined') {
      // 2 arguments
      if (isNaN(arg1) && isNaN(arg2)) { // tileSize, and p1 are vectors, p2 is default.
        tileSize = gamework.math.vector(arg1);
        p1       = gamework.math.vector(arg2);
      } else if (!(isNaN(arg1) || isNaN(arg2))) { // tileSize is 2 numbers, p1 and p2 are defualt
        tileSize = gamework.math.vector(+arg1, +arg2);
      }
    } else if (typeof(arg1) !== 'undefined') {
      // 1 argument should be a vector for tileSize
      tileSize = gamework.math.vector(arg1);
    }
    
    
    if (!((tileSize === null) || (p1 === null) || (p2 === null))) {
      if (name !== '') {
        if (!tilesets.hasOwnProperty(nameCi)) {
          tileSet = new TileSet(name, image, tileSize.x, tileSize.y, p1.x, p1.y, p2.x, p2.y);
          
          tilesets[nameCi] = tileSet;
        } else {
          name = '';
        }
      }
    } else {
      name = '';
    }
    
    return name;
  }

  
  exports.install = function (ns) {
    ns.newtileset = newtileset;
    
    
    ns.newanimation = function (tilesetname, animationname, frames, loop, rate) {
      var tileset, animationnameCi, animation, validFrames = true;
      
      tilesetname = internal.validateId(tilesetname);
      
      animationname   = internal.validateId(animationname);
      animationnameCi = animationname.toLowerCase();
      
      if (typeof(loop) === 'undefined') {
        loop = 'cycle';
      }
      if (typeof(rate) === 'undefined') {
        rate = 1;
      }
      
      loop = internal.validateId(loop).toLowerCase();
      rate = Math.floor(+rate);
      
      if ((tilesetname !== '')
      &&  (animationname !== '') 
      &&  (gamework.types.gettype(frames) === 'array')
      &&  gamework.collections.contains(['cycle', 'pingpong', 'none'], loop)
      &&  isFinite(rate)
      &&  (rate > 0)) {
        frames = gamework.collections.map(function (i) { return +i; }, frames);
        
        validFrames = gamework.collections.reduce(function (a, i) { return a && !isNaN(i); }, validFrames, frames);
        
        tileset = internal.getTileSet(tilesetname);
        
        if ((tileset !== null) && validFrames) {
          if (!tileset.animations.hasOwnProperty(animationnameCi)) {
            animation = {
              name:   animationname,
              frames: frames,
              loop:   loop,
              rate:   rate
            };
            
            tileset.animations[animationnameCi] = animation;
          } else {
            animationname = '';
          }
        } else {
          animationname = '';
        }
      } else {
        animationname = '';
      }
      
      return animationname;
    };
    
    
    ns.renametileset = function (fromname, toname) {
    };
    
    if (oldInstall) { oldInstall(ns); }
  };
  
  internal.getTileSet = function (name) {
    name = internal.validateId(name).toLowerCase();
    
    if ((name !== '') && tilesets.hasOwnProperty(name)) {
      return tilesets[name];
    }
    
    return null;
  };
  
  exports.install(exports);
}(gamework.graphics, gamework.internal));
