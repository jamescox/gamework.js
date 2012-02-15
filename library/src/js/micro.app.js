/*
    TODO:
     *  State stack.
     *  Loading state.
     *  Play / Pause.
     *  Frame rate control.
 */


var micro     = micro || {};
    micro.app = micro.app || {};
    
(function (exports) {
  var state, mainloop, loopCallbacks = [];
  
  function loadScript(src, callback) {
    var scriptEl = document.createElement('script');
    
    scriptEl.onload = callback;
    scriptEl.src    = src;
    
    document.head.appendChild(scriptEl);
  }
  
  
  function StateManager() {
    this.stack = [];
  }
  
  StateManager.prototype.push = function (statename) {
    this.stack.push('' + statename);
  };
  
  StateManager.prototype.pop = function () {
  };
  
  StateManager.prototype.set = function (statename) {
  };
  
  StateManager.prototype.init = function () {
    // When a new state is added to the stack.
  };
  
  StateManager.prototype.enter = function () {
    // When control retrurn to a state.
  };
  
  StateManager.prototype.update = function () {
    // Updates the top-most state.
    var state      = this.stack[this.stack.length - 1],
        updateName = 'update';
    
    if (state) {
      updateName += '_' + state;
    }
    
    if (typeof(window[updateName]) === 'function') {
      window[updateName]();
    }
  };
  
  StateManager.prototype.leave = function () {
    // When control leaves the a state.
  };
  
  StateManager.prototype.term = function () {
    // When a state is poped of the stack.
  };
  
  function IntervalMainLoop(loopCallback) {
    this.running      = false;
    this.fps          = 30;
    this.interval     = null;
    this.loopCallback = loopCallback;
  }
  
  IntervalMainLoop.prototype.setFps = function (fps) {
    fps = +fps;
    
    if ((this.fps !== fps) && (fps > 0)) {
      this.fps = fps;
      
      if (this.running) {
        this.stop();
        this.start();
      }
    }
  };
  
  IntervalMainLoop.prototype.getFps = function () {
    return this.fps;
  };
  
  IntervalMainLoop.prototype.start = function () {
    if (!this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
      }
      
      this.interval = window.setInterval(this.loopCallback, 1000 / this.fps);
      this.running  = true;
    }
  };
  
  IntervalMainLoop.prototype.stop = function () {
    if (this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = null;
      }
      
      this.running = false;
    }
  };
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      title: {
        get: function () {
          return document.title;
        },
        set: function (title) {
          document.title = title;
        }
      },
      
      fps: {
        get: function () {
          return mainloop.getFps();
        },
        set: function (fps) {
          mainloop.setFps(fps);
        }
      }
    });
    
    Object.defineProperties(ns, {
      pushstate: {
        value: function (newstate) {
        }
      },
      
      popstate: {
        value: function () {
        }
      },
      
      changestate: {
        value: function (newstate) {
        }
      }
    });
    
    Object.defineProperties(ns, {
      startloadtask: {
        value: function () {
          
        }
      },
      
      completeloadtaks: {
        value: function () {
          
        }
      }
    });
    
    
    ns.__onloadhandler = function (flatten, mainScript) {
      return function () {
        micro.graphics.__reparent(document.body);
        
        if (flatten) {
          micro.types.install(window);
          micro.collections.install(window);
          micro.math.install(window);
          micro.graphics.install(window);
          micro.app.install(window);
        }
        
        state = new StateManager();
        state.push(''); // The default state.
        mainloop = new IntervalMainLoop(function () {
          loopCallbacks = [
            function () { state.update.call(state); }, 
            micro.graphics.__loopcallback];
          
          micro.collections.foreach(function (item) {
            item();
          }, loopCallbacks);
        });
        mainloop.start();
        
        micro.app.title = 'Untitled Application';
        loadScript(mainScript, function () {
          window.clearInterval(window.__titleAnimation__);
        });
      };
    };
  };
  
  exports.install(exports);
}(micro.app));
