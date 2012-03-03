// NOTE:  This is not the main.js file that will eventually end up in
//        the template director, this is just for testing various 
//        features during development.  See main.default.js for the
//        template main.js file.


spriteskin = 'ghost'; fillcolor = '#0f0'; show();

newlayer('top');
spriteskin = 'ghost'; fillcolor = '#f00'; show();

currentlayer = 'default';
newlayer('bottom', 'below');
spriteskin = 'ghost'; fillcolor = '#00f'; show();

currentlayer = 'default';
