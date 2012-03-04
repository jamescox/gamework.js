// NOTE:  This is not the main.js file that will eventually end up in
//        the template director, this is just for testing various 
//        features during development.  See main.default.js for the
//        template main.js file.


show();

spriteupdate = function () {
  if (keypressed('left')) {
    left(10);
  }
  if (keypressed('right')) {
    right(10);
  }
  if (keypressed('up')) {
    forward(10);
  }
  if (keypressed('down')) {
    back(10);
  }
  if (keypressed('h')) {
    home();
  }
  if (keypressed('c')) {
    clear();
  }
  if (keypressed('1')) {
    pencolor = 'black';
  }
  if (keypressed('2')) {
    pencolor = 'red'
  }
  if (keypressed('3')) {
    pencolor = 'green';
  }
  if (keypressed('4')) {
    pencolor = 'blue'
  }
  if (keypressed('5')) {
    pencolor = 'white'
  }
};
