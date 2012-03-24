(function (exports) {
  var sounds = {};
  
  
  function loadSound(name) {
    var src, sound = null;
    
    if (sounds.hasOwnProperty(name)) {
      sound = sounds[name];
    } else {
      sound = new Audio();
      
      sound.setAttribute('preload', 'preload');
      
      gamework.game.startloadtask();
      sound.oncanplay = function () {
        gamework.game.endloadtask();
      };
      
      src = document.createElement('source');
      src.setAttribute('src', 'game/resources/' + name + '.ogg');
      src.setAttribute('type', 'audio/ogg');
      sound.appendChild(src);

      src = document.createElement('source');
      src.setAttribute('src', 'game/resources/' + name + '.mp3');
      src.setAttribute('type', 'audio/mp3');
      sound.appendChild(src);
            
      src = document.createElement('source');
      src.setAttribute('src', 'game/resources/' + name + '.wav');
      src.setAttribute('type', 'audio/wav');
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

    sound.cloneNode(true).play();
  }
  
  
  exports.install = function (ns) {
    ns.loadsound = loadSound;
    ns.playsound = playSound;
  };
  
  exports.install(exports);
}(gamework.sound));
