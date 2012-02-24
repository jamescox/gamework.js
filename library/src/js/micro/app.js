/*jslint browser: true, white: true, nomen: true, maxerr: 50, indent: 2 */

/*
    TODO:
     *  State stack.
     *  Loading state.
     *  Play / Pause.
     *  Frame rate control.
 */

    
(function (exports, _) {
  'use strict';
 
  var loadingOverlay, state, mainloop, loadingJobs = 0, loopCallbacks = [];
  
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
        value: function () {
        }
      },
      
      popstate: {
        value: function () {
        }
      },
      
      changestate: {
        value: function () {
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
        _.graphicsOnLoad(document.body);
        
        if (flatten) {
          micro.types.install(window);
          micro.string.install(window);
          micro.collections.install(window);
          micro.math.install(window);
          micro.graphics.install(window);
          micro.app.install(window);
          micro.sound.install(window);
        }
        
        loadingOverlay = document.createElement('div');
        loadingOverlay.innerHTML = 'Loading...';
        loadingOverlay.style.display = '';
        
        loadingOverlay.setAttribute('class',     'micro-loading-overlay');
        loadingOverlay.setAttribute('className', 'micro-loading-overlay');
        
        document.body.appendChild(loadingOverlay);
        
        state = new StateManager();
        mainloop = new IntervalMainLoop([
            function () { state.update.call(state); }, 
            _.graphicsUpdate
        ]);
        mainloop.startloadtask();
        mainloop.start();
        
        window.clearInterval(window.__titleAnimation__);
        micro.app.title = 'Untitled Application';
        loadScript(mainScript, function () {
          state.push(''); // The default state.
          mainloop.endloadtask();
        });
      };
    };
  };
  
  exports.install(exports);
}(micro.app, micro._));
