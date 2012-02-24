(function (exports) {
  var sounds = {};
  
  
  function loadSound(name) {
    var src, sound = null;
    
    if (sounds.hasOwnProperty(name)) {
      sound = sounds[name];
    } else {
      sound = new Audio();
      
      sound.setAttribute('preload', 'preload');
      
      micro.app.startloadtask();
      sound.oncanplay = micro.app.endloadtask;
      
      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.wav');
      src.setAttribute('type', 'audio/wav');
      sound.appendChild(src);

      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.ogg');
      src.setAttribute('type', 'audio/vorbis');
      sound.appendChild(src);
      
      src = document.createElement('source');
      src.setAttribute('src', 'app/' + name + '.mp3');
      src.setAttribute('type', 'audio/mp3');
      sound.appendChild(src);
      
      sound.load();
      
      sounds[name] = sound;
      
      document.body.appendChild(sound);
    }
    
    return sound;
  }
  
  
  function playSound(name) {
    var sound;
    
    if (sounds.hasOwnProperty(name)) {
      sound = sounds[name];
    } else {
      sound = loadSound(name);
    }
    
    console.log(sound.currentSrc);
    sound.currentTime = 0;
    sound.play();
  }
  
  
  exports.install = function (ns) {
    ns.loadsound = loadSound;
    ns.playsound = playSound;
  };
  
  exports.install(exports);
}(micro.sound));
