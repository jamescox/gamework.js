resizescreen(500, 500)

title = 'Colourfull Sprites';

fps = 30;
backgroundcolor = '#ddd';
bordercolor = 'black';

show();

newsprite('red');
spriteskin = 'ghost';
forward(100);
right(90);
pensize  = 3;
pencolor = 'rgba(255, 0, 0, 0.333)';
pendown();

newsprite('blue');
spriteskin = 'ghost';
back(100);
left(90);
pensize  = 3;
pencolor = 'rgba(0, 0, 255, 0.333)';
pendown();

newsprite('green');
spriteskin = 'ghost';
right(90);
forward(100);
right(90);
pensize  = 3;
pencolor = 'rgba(0, 128, 0, 0.333)';
pendown();

newsprite('yellow');
spriteskin = 'pacman';
left(90);
forward(100);
right(90);
pensize  = 3;
pencolor = 'yellow'; //'rgba(255, 255, 0, 0.333)';
pendown();

frames = 0;

var update = function () {
  var sprites = ['red', 'blue', 'green', 'yellow'];
  
  frames += 1;
  
  foreach(function (name) {
    sprite = name;
    
    forward(12);
    right(10);
    if (frames % 36 === 0) {
      right(12);
    }
  }, sprites);

  sprite = 'default';
  //right(1);
};

