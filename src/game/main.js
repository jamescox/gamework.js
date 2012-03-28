// NOTE:  This is not the main.js file that will eventually end up in
//        the template director, this is just for testing various 
//        features during development.  See main.default.js for the
//        template main.js file.

var tilesize  = 20;
var snakesize = 5;

var snake = [newsprite()];
var xdirection = tilesize;
var ydirection = 0;

spriteskin = 'square';
spritesize = [tilesize, tilesize];

fps = 6;

update = function () {
  // Get the snake's head's current position.
  var oldx = spritex;
  var oldy = spritey;
  
  // Respond to the keyboard controls.
  if (keydown('right')) {
    xdirection = tilesize;
    ydirection = 0;
  }
  if (keydown('left')) {
    xdirection = -tilesize;
    ydirection = 0;
  }
  if (keydown('up')) {
    xdirection = 0;
    ydirection = tilesize;
  }
  if (keydown('down')) {
    xdirection = 0;
    ydirection = -tilesize;
  }
  
  // Add a new sprite to the snakes body.
  snake.push(newsprite());
  spriteskin = 'square';
  spritesize = [tilesize, tilesize];
  
  // When the snake is too long remove its tail.
  if (snake.length > snakesize) {
    removesprite(snake.shift());
  }
  
  // Move the newly created head in the current direction.
  moveto(oldx + xdirection, oldy + ydirection);
  
  // Wrap the edges of the screen, so that when the snake leaves on
  // one side of the screen he reappears at the oposite side.
  if (spritex > screenright) {
    spritex = screenleft;
  }
  if (spritex < screenleft) {
    spritex = screenright;
  }
  if (spritey > screentop) {
    spritey = screenbottom;
  }
  if (spritey < screenbottom) {
    spritey = screentop;
  }
};
