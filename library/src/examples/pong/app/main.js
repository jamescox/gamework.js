function init() {
  resizescreen(600, 400);
  
  title = 'Pong';
  background = 'black';
  
  newsprite('ball');

  spritedata = {i: 10, j: 10};

  spriteupdate = function () {
  };


  newsprite('player1');


  newsprite('player2');
}