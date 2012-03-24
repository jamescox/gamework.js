(function (exports) {
  'use strict';
  
  var EMPTY_TILE = { tile: 0, base: 0 };
  
  
  function TileMap() {
    this.width  = 1;
    this.height = 1;
    this.tiles  = [];
  };
  
  
  TileMap.prototype.draw = function (g, tilesetname, width, height) {
    var r, c, x, y,
        tile,
        tileWidth  = width / this.width,
        tileHeight = height / this.height,
        tileSet    = exports.getTileSet(tilesetname);
    
    if (tileSet !== null) {
      y = (height / 2) - (tileHeight / 2);
      for (r = 0; r < this.height; r += 1) {
        x = -(width / 2) + (tileWidth / 2);
        for (c = 0; c < this.width; c += 1) {
          tile = (this.tiles[r] || [])[c] || EMPTY_TILE;
          
          g.save()
          g.translate(x, y);
          
          if (typeof(tile.tile) === 'string') {
            tileSet.drawAnimatedTile(g, tile.tile, tile.base, tileWidth, tileHeight);
          } else {
            tileSet.drawIndexedTile(g, tile.tile, tileWidth, tileHeight);
          }
          
          g.restore();
          
          x += tileWidth;
        }
        
        y -= tileHeight;
      }
    }
  };
  
  
  TileMap.prototype.resize = function (g, width, height) {
  };
  
  
  // tile()        -> gets tile[0, 0]
  // tile(t)       -> sets tile[0, 0] = t
  // tile(v)       -> gets tile @ v
  // tile(v, t)    -> sets tile @ v = t
  // tile(x, y)    -> gets tile[x, y]
  // tile(x, y, t) -> sets tile[x, y] = t
  TileMap.prototype.tile = function (arg1, arg2, arg3) {
    var oldTile, v, x = 0, y = 0, tile, base = gamework.graphics.framecount;
    
    if (typeof(arg3) !== 'undefined') {
      x    = +arg1;
      y    = +arg2;
      tile = arg3;
    } else if (typeof(arg2) !== 'undefined') {
      if (isNaN(arg1)) {
        // vector, and tile.
        v    = gamework.math.vector(arg1);
        x    = v.x;
        y    = v.y;
        tile = arg2;
      } else {
        // number, number
        x = +arg1;
        y = +arg2;
      }
    } else if (typeof(arg1) !== 'undefined') {
      if (!isNaN(arg1) || (typeof(arg1) === 'string')) {
        // tile.
        tile = arg1;
      } else {
        // vector.
        v = gamework.math.vector(arg1);
        x = v.x;
        y = v.y;
      }
    }
    
    if (isFinite(x) && (x >= 0) 
    &&  isFinite(y) && (y >= 0)) {
      if (typeof(tile) === 'undefined') {
        // get.
        tile = (this.tiles[y] || [])[x] || 0;
      } else {
        // set.
        if (isFinite(tile) || (typeof(tile) === 'string')) {
          while (this.tiles.length <= y) {
            this.tiles.push([]);
          }
          while (this.tiles[y].length <= x) {
            this.tiles[y].push(null);
          }
          
          oldTile = this.tile(x, y).tile;
          
          if (tile !== oldTile) {
            this.tiles[y][x] = { tile: tile, base: base };
          }
          
          if (this.width <= x) {
            this.width = x + 1;
          }
          if (this.height <= y) {
            this.height = y + 1;
          }
        } else {
          tile = '';
        }
      }
    } else {
      tile = '';
    }
    
    return tile;
  };
  
  
  exports.install = function (ns) {
    ns.TileMap = TileMap;
  };
  
  exports.install(exports);
}(gamework.internal));
