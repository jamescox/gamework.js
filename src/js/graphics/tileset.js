(function (exports, internal) {
  'use strict';
  
  var oldInstall = exports.install, tilesets = {};
  
  
  function Sequence(name, frames, frameratio, loops, loopmode) {
  }
  
  
  function TileSet(name, imagename, tilewidth, tileheight, originx, originy) {
    this.name       = name;
    
    this.imagename  = imagename
    this.image      = internal.getImage(imagename);
    
    this.tilewidth  = tilewidth;
    this.tileheight = tileheight;
    this.originx    = originx;
    this.originy    = originy;
    
    this.widthInTiles  = -1;
    this.heightInTiles = -1;
    this.tiles         = -1;
    
    this.sequences  = {};
  }
  
  
  TileSet.prototype.drawIndexedTile = function (g, index, width, height) {
    if (isFinite(index)) {
      index = Math.floor(+index);
      
      if (this.image.ready) {
        if (this.tiles === -1) {
          this.widthInTiles  = Math.floor(
            (this.image.width  - this.originx) / this.tilewidth);
          this.heightInTiles = Math.floor(
            (this.image.height - this.originy) / this.tileheight);
          this.tiles = (this.widthInTiles * this.heightInTiles);
        }
        
        index = gamework.math.wrapint(index, this.tiles + 1);
        
        if (index > 0) {
          index -= 1;
          
          g.save();
          g.scale(1, -1);
          
          g.drawImage(
            this.image, 
            this.originx + (index % this.widthInTiles)  * this.tilewidth,
            this.originy + Math.floor(index / this.heightInTiles) * this.tileheight,
            this.tilewidth, this.tilewidth,
            -width / 2, -height / 2, width, height);
          
          g.restore();
        }
      }
    }
  };
  
  
  exports.install = function (ns) {
    // newtileset(name : string, image : string, framewidth : number, frameheight : number, originx : number, originy : number)
    ns.newtileset = function (name, image, tilewidth, tileheight, originx, originy) {
      var nameCi, tileset;
      
      name   = internal.validateId(name);
      nameCi = name.toLowerCase();
      
      if (name !== '') {
        if (!tilesets.hasOwnProperty(nameCi)) {
          tileset = new TileSet(name, image, tilewidth, tileheight, originx, originy);
          
          tilesets[nameCi] = tileset;
        } else {
          return '';
        }
      }
      
      return name;
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
