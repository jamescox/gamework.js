GameWork for JavaScript
=======================

Intorduction
------------
gamework.js is a simple 
[JavaScript](http://en.wikipedia.org/wiki/JavaScript) framework for 
creating small [HTML5](http://en.wikipedia.org/wiki/Html5) computer
games.  It is intended for use by beginner programmers that have 
no prior knowledge of computer programming.  The environment it provides 
is very much inspired by the minimal programming environments of the 
[microcomputers](http://en.wikipedia.org/wiki/Amstrad_CPC) from the 
1980s, drawing ideas from both the 
[BASIC](http://en.wikipedia.org/wiki/Locomotive_BASIC) and 
[LOGO](http://en.wikipedia.org/wiki/Logo_%28programming_language%29) 
graphics APIs.


Goals
-----
 *  A simple environment that allows beginner programmers to start 
    writing visually intersting applications quickly.
 

Guidelines
----------
 *  Only require the user to understand values (numbers, stings, 
    arrays, objects and functions), variables, control stuctures, 
    function calls and declarations.
 *  Focus on a more functional programming style al-la LISPs and LOGOs.
 *  This may be contiversial, but favor a flat global namespace for the
    functions of the library.
 *  It sould be possible to do something visual with only one line of 
    code.
 *  Use best practice when it dosn't get in the way of the previous 
    guide lines.


Downloading and creating a new project
--------------------------------------
Download the 
[zip file](https://github.com/jamescox/gamework.js/zipball/master) from
this page and extract the files.  To start a new project using this 
library simply:
 1. Copy the template directory from the build directory in the 
    extracted files a new location.
 2. Rename the copied template directory to some thing meaningful to 
    you.  Probably the name of the game or project your working on.
 3. Edit the main.js script in the game directory of your new project.
    This file is run automatically when your projects index.html file
    is launched.
 4. After editing the main.js script simply reload the index.html file
    to see the results.


Examples usage of some basic GameWork features
----------------------------------------------
To set the title of the project:

    title = 'title of my project';

To resize the area of the screen where drawing can occurre (the page):

    //     width, height
    resize(800,   600);
    
To set the background color of the page using a named color:

    pagecolor = 'orange';        

Set the border color in the same way but using the following property:
    
    bordercolor = 'blue';
    
Show and hide the current sprite:

    // Show the sprite.
    show();
    
    // Hide the sprite.
    hide();
    
    // Half show/hide sprite.
    spriteopacity = 0.5;
    
Move the sprite around:
    
    // Back to center.
    home();
    
    // Move to a given coorinate.
    //     x,   y
    moveto(50, -10);
    
Each sprite holds a pen, this is used to draw on the paper of the 
current layer when the sprites pen is down.  To change the properties 
of the current sprites pen:

    // Lift pen of paper.
    penup();
    
    // Place pen on paper.
    pendown();

    // Change color.
    pencolor = 'yellow';
    
    // Change size.
    pensize = 7;

To draw using the pen:

    // Draw from the current location by moving the sprite forward by 100.
    forward(100);
    
    // Same but backwards.
    back(100);
    
    // Draw from the current location to the given location.
    //    x,  y
    pento(10, 10);
    
Turn the sprite to face different directions with:

    //   degrees
    left(45);
    
    //    degrees
    right(45);
    
To change the appearance of the sprite:

    spriteskin = 'arrow';     // this is the default.
    spriteskin = 'circle';
    spriteskin = 'ellipse';
    spriteskin = 'square';
    spriteskin = 'rectangle';
    spriteskin = 'pac-man';
    spriteskin = 'ghost';

    
To update the scene every frame you can give each sprite a function to 
call:

    spriteupdate = function () {
      // Move the sprite based on keyboard controls.
      if (keydown('up')) {
        forward(5);
      }
      if (keydown('down')) {
        back(5);
      }
      
      // Rotate the sprite based on keyboard controls.
      if (keydown('left')) {
        left(5);
      }
      if (keydown('right')) {
        right(5);
      }
      
      // Pen up/down based on keyboard controls.
      if (keydown('p')) {
        togglepen();
      }
      
      // Change pen color based on keyboard controls.
      
      
      // Make sprite wrap around the x-axis.
      if (spritex > 200) {
        spritex = -200;
      } else if (spritex < -200) {
        spritex = 200;
      }
      
      // Make sprite wrap around the y-axis.
      if (spritey > 200) {
        spritey = -200;
      } else if (spritey < -200) {
        spritey = 200;
      }
    };
    