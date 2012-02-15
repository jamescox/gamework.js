// NOTE:  This is the 'test' main.js file the contents can be anything
//        useful for testing.

// Setup screen
title           = 'Colourful Sprites';
bordercolor     = '#222';
backgroundcolor = '#ddd';
fps             = 30;
resizescreen(500, 500);


// Setup sprites.
right(90);
pencolor   = 'yellow';
pensize    = 5;
spriteskin = 'pacman';
show()

newsprite('shadow');
moveto(0, 200);
right(30);
spriteskin = 'ghost';
pencolor   = 'red';
pensize    = 2;
pendown();

newsprite('speedy');
moveto(0, 100);
left(60);
spriteskin = 'ghost';
pencolor   = '#ffb8ff';
pensize    = 2;
pendown();

newsprite('bashful');
moveto(0, -100);
right(30);
spriteskin = 'ghost';
pencolor   = '#0ff';
pensize    = 2;
pendown();

newsprite('pokey');
moveto(0, -200);
left(60);
spriteskin = 'ghost';
pencolor   = '#ffb851';
pensize    = 2;
pendown();

frames = 0;

// Update function moves ghosts.
update = function () {
  var i, ghosts = ['shadow', 'speedy', 'bashful', 'pokey'];
  
  frames += 1;
  
  for (i = 0; i < len(ghosts); i += 1) {
    sprite = ghosts[i];
    forward(10);
    right(3);
    if (frames % (360 / 3) === 0) {
      left(6);
      forward(10);
    }
    
    if (spritey > 250) {
      spritey = -250;
    }
    if (spritey < -250) {
      spritey = 250;
    }
    
    if (spritex > 250) {
      spritex = -250;
    }
    if (spritex < -250) {
      spritex = 250;
    }
  }
  
  // Leave default sprite active.
  sprite = 'default';
};
