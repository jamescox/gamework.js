title = 'Colourful Sprites';
pagecolor = 'white';
resize(600, 600);


for (var i = 0; i < 100; i += 1) {
  newsprite()
  moveto(random(-300, 300), random(-300, 300));
  
  pendown()
  pencolor = color(randompick(['red', 'yellow', 'green', 'cyan', 'blue', 'purple']))
  pencolor = color(pencolor.r, pencolor.g, pencolor.b, random(0.333, 0.667));
  pensize  = random(3, 7);
  
  spriteupdate = function () {
    if (mousebutton(3)) {
      lookaway(mousex, mousey, 10);
    } else {
      lookat(mousex, mousey, 10);
    }
    if (mousebutton(1)) {
      forward(10);
    } else if (mousebutton(3)) {
      forward(7.5);
    }
  };
}

