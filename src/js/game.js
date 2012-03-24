/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */

/*
    TODO:
     *  State stack.
     *  Loading state.
     *  Play / Pause.
     *  Frame rate control.
 */

    
(function (exports, internal) {
  'use strict';
 
  var loadingOverlay, state, mainloop, loadingJobs = 0, loopCallbacks = [];
  
  function loadScript(src, callback) {
    var scriptEl = document.createElement('script');
    
    scriptEl.onload  = callback;
    scriptEl.src     = src;
    
    document.head.appendChild(scriptEl);
  }
  
  
  function StateManager() {
    this.stack = [];
  }
  
  StateManager.prototype.push = function (statename) {
    this.stack.push(statename.toString());
    this.init();
  };
  
  StateManager.prototype.pop = function () {
  };
  
  StateManager.prototype.set = function () {
  };
  
  StateManager.prototype.init = function () {
    var state    = this.stack[this.stack.length - 1],
        initName = 'init';
    
    if (state) {
      initName += '_' + state;
    }
    
    if (typeof(window[initName]) === 'function') {
      window[initName]();
    }
  };
  
  StateManager.prototype.enter = function () {
    
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
  
  StateManager.prototype.change = function (name) {
    if (this.stack.length === 0) {
      this.push(name);
    } else {
      this.stack[this.stack.length - 1] = name;
    }
  };
  
  function IntervalMainLoop(loopCallbacks) {
    this.running       = false;
    this.fps           = 30;
    this.interval      = null;
    this.loopCallbacks = loopCallbacks;
    this.loadtasks     = 0;
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
  
  
  IntervalMainLoop.prototype.startloadtask = function () {
    if (this.loadtasks === 0) {
      loadingOverlay.style.display = 'block';
    }
    
    this.loadtasks += 1;
  };
  
  
  IntervalMainLoop.prototype.endloadtask = function () {
    this.loadtasks = Math.max(0, this.loadtasks - 1);
    
    if (this.loadtasks === 0) {
      loadingOverlay.style.display = 'none';
    }
  };
  
  
  
  IntervalMainLoop.prototype.getFps = function () {
    return this.fps;
  };
  
  IntervalMainLoop.prototype.start = function () {
    var self = this;
    
    if (!this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
      }
      
      this.interval = window.setInterval(function () {
        if (self.loadtasks === 0) {
          foreach(function (callback) {
            callback();
          }, self.loopCallbacks);
        }
      }, 1000 / this.fps);
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
        value: function (name) {
          state.push(name);
        }
      },
      
      popstate: {
        value: function () {
          
        }
      },
      
      changestate: {
        value: function (name) {
          state.change(name);
        }
      }
    });
    
    Object.defineProperties(ns, {
      startloadtask: {
        value: function () {
          mainloop.startloadtask();
        }
      },
      
      endloadtask: {
        value: function () {
          mainloop.endloadtask();
        }
      }
    });
    
    
    ns.start = function () {
      mainloop.start();
    };
    
    
    ns.stop = function () {
      mainloop.stop();
    };
    
    
    ns.__onloadhandler = function (flatten, mainScript) {
      return function () {
        internal.graphicsOnLoad(document.body);
        
        if (flatten) {
          gamework.types.install(window);
          // gamework.help.install(window);
          gamework.string.install(window);
          gamework.collections.install(window);
          gamework.math.install(window);
          gamework.graphics.install(window);
          gamework.input.install(window);
          gamework.game.install(window);
          gamework.sound.install(window);
        }
        
        loadingOverlay = document.createElement('div');
        loadingOverlay.innerHTML = 'Loading...';
        loadingOverlay.style.display = '';
        
        loadingOverlay.setAttribute('class',     'gw-loading-overlay');
        loadingOverlay.setAttribute('className', 'gw-loading-overlay');
        
        document.body.appendChild(loadingOverlay);
        
        state = new StateManager();
        mainloop = new IntervalMainLoop([
            function () { state.update.call(state); }, 
            internal.graphicsUpdate
        ]);
        mainloop.startloadtask();
        mainloop.start();
        
        window.clearInterval(window.__titleAnimation__);
        document.title = 'Untitled Game';
        loadScript(mainScript, function () {
          mainloop.endloadtask();
        });
      };
    };
  };
  
  exports.install(exports);
}(gamework.game, gamework.internal));
