var ballx = 0,  bally = 0;
var balli = 10, ballj = 10;
var player1y = 0;
var player2y = 0;


function init() {
  title = 'Pong';
  backgroundcolor = 'black';
  
  resizescreen(600, 400);
  
  newsprite('ball');
  spriteskin   = 'square';
  spritedata   = {i: 10, j: 10};
  spritewidth  = 20;
  spriteheight = 20;


  newsprite('player1');
  moveto(-270, 0);
  spriteskin   = 'rectangle';
  spritewidth  = 20;
  spriteheight = 100;;
  
  
  newsprite('player2');
  moveto(270, 0);
  spriteskin   = 'rectangle';
  spritewidth  = 20;
  spriteheight = 100;
}


function update() {
  ballx += balli;
  bally += ballj;

  if (ballx > 290) {
    ballx =  290;
    balli = -balli;
  } else if (ballx < -290) {
    ballx = -290;
    balli = -balli;
  }
  if (bally > 190) {
    bally =  190;
    ballj = -ballj;
  } else if (bally < -190) {
    bally = -190;
    ballj = -ballj;
  }
  
  if (ballx < 0) {
    if (bally < player1y) {
      player1y -= 5;
    } else if (bally > player1y) {
      player1y += 5;
    }
  }
  
  /*
  if (key('up')) {
    player2y += 5;
  }
  if (key('down'))  {
    player2y -= 5;
  }
  */
  player2y = mousey;
  
  sprite = 'ball';
  moveto(ballx, bally);
  
  sprite  = 'player1';
  spritey = player1y;
  
  sprite  = 'player2';
  spritey = player2y;
}
