// NOTE:  This is the 'test' main.js file the contents can be anything
//        useful for testing.

resizescreen(800, 800);

//fps = 4;

colors = [
  '  0,   0,   0',
  '255,   0,   0',
  '255, 255,   0',
  '  0, 255,   0',
  '  0, 255, 255',
  '  0,   0, 255',
  '255,   0, 255',
  '255, 255, 255'
];

for (var i = 0; i < 100; i += 1) {
  newsprite(i);
  moveto(random(-400, 400), random(-400, 400));
  pendown();
  pencolor = 'rgba(' + randompick(colors) + ', ' + random(0.1, 0.5).toFixed(2) + ')';
  pensize = random(1, 5);

  spriteupdate = function () {
    var dx = mousex - spritex;
    var dy = mousey - spritey;
    
    //console.log(mousex, mousey)
    var targetangle = arctan2(dx, dy);
    
    if (targetangle > spriteangle) {
      spriteangle += min(abs(spriteangle - targetangle), 8);
    } else if (targetangle < spriteangle) {
      spriteangle -= min(abs(spriteangle - targetangle), 8);
    }
    
    if (mousebutton(1)) {
      forward(10);
      spriteskin = '/test-card.png';
    }
  };
}
