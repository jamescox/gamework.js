var length = 20, li = 0.1, r = 255, g = 0, b = 0, ri = -1, gi = 1, bi = 0;

show();

hello = function () {
  pencolor = [r / 255, g / 255, b / 255, 0.667];
  forward(length);
  right(9);
  
  r = r + ri;
  g = g + gi;
  b = b + bi;
  
  if ((r === 0) && (g === 255)) {
    ri =  0;
    gi = -1;
    bi =  1;
  } else if ((g === 0) && (b === 255)) {
    ri =  1;
    gi =  0;
    bi = -1;
  } else if ((b === 0) && (r === 255)) {
    ri = -1;
    gi =  1;
    bi =  0;
  }
  length = length - li;
  
  pensize += 0.01;
  
  if (length < -20) {
    li = -li;
  }
  
  if (length > 20) {
    li = -li;
  }
};

pagecolor = 'white';
pensize = 8;

spriteupdate = hello;

newsprite('jake');
right(180);
spriteupdate = hello;
pendown();