// NOTE:  This is not the main.js file that will eventually end up in
//        the template director, this is just for testing various 
//        features during development.  See main.default.js for the
//        template main.js file.


title = 'Pong';
pagecolor = 'black';
resize(600, 400);

newsprite('net');
spriteskin = 'rectangle';
spritewidth  = 10;
spriteheight = 380;

newsprite('ball');
spriteskin = 'circle';
spritewidth  = 10;
spriteheight = 10;

newsprite('bat1');
moveto(-280, 0);
spriteskin = 'rectangle';
spritewidth  = 10;
spriteheight = 80;

newsprite('bat2');
moveto(280, 0);
spriteskin = 'rectangle';
spritewidth  = 10;
spriteheight = 80;

bat1Y = 0;
bat2Y = 0;
ballX = 0;
ballY = 0;
ballI = 5;
ballJ = 5;

changestate('bat1serve');

movesprites = function() {
  currentsprite = 'ball';
  moveto(ballX, ballY);
  
  currentsprite = 'bat1';
  moveto(-280, bat1Y);
  
  currentsprite = 'bat2';
  moveto(280, bat2Y);
};


update_bat1serve = function () {
  ballX = -270;
  ballY = bound(-200, mousey, 200);
  bat1Y = ballY;
  
  movesprites();
  
  if (mousebutton(1)) {
    changestate('play');
  }
};


update_bat2serve = function () {
  ballX = 270;
  bat1Y = bound(-200, mousey, 200);
  
  movesprites();
};


enter_play = function () {
  currentsprite = 'net';  show();
  currentsprite = 'ball'; show();
  currentsprite = 'bat1'; show();
  currentsprite = 'bat2'; show();
};


update_play = function () {
  ballX += ballI;
  ballY += ballJ;
  
  if (ballY > 195) {
    ballY = 195;
    ballJ = -ballJ;
    
    playsound('blip');
  } else if (ballY < -195) {
    ballY = -195;
    ballJ = -ballJ;
    
    playsound('blip');
  }
  
  if (ballI > 0) {
    if ((ballX < 270) && (ballX + ballI >= 270)) {
      if ((ballY > bat2Y - 40) && (ballY < bat2Y + 40)) {
        ballX = 270;
        ballI = -ballI;
        
        playsound('blip');
      }
    }
  } else if (ballI < 0) {
    if ((ballX > -270) && (ballX + ballI <= -270)) {
      if ((ballY > bat1Y - 40) && (ballY < bat1Y + 40)) {
        ballX = -270;
        ballI = -ballI;
        
        playsound('blip');
      }
    }
  }
  
  if (ballX > 300) {
    changestate('bat1serve');
  }
  
  if (ballX < -300) {
    changestate('bat2serve');
  }
  
  bat1Y = bound(-200, mousey, 200);
  
  movesprites();
};

