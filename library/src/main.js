// NOTE:  This is the 'test' main.js file the contents can be anything
//        useful for testing.

show();

//fps = 4;

spriteupdate = function () {
  var dx = mousex - spritex;
  var dy = mousey - spritey;
  
  //console.log(mousex, mousey)
  spriteangle = arctan2(dx, dy);
  
  if (mousebutton(1)) {
    moveto(mousex, mousey);
  }
};
